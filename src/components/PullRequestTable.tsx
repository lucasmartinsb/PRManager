import { PullRequest, useGetPullRequests } from '@/hooks/useGetPullRequests';
import { useGetSession } from '@/hooks/useGetSession';
import { Icon } from '@iconify/react';
import { Table, TableTd, TableThead, TableTh, TableTr, TableTbody, Avatar, Button, Container, Select, Modal, Textarea, Group } from '@mantine/core';
import trashCanOutline from '@iconify-icons/akar-icons/trash-can';
import commentAdd from '@iconify-icons/akar-icons/comment-add';
import { useRemovePullRequest } from '@/hooks/useRemovePullRequest';
import { useSetRevisor } from '@/hooks/useSetRevisor';
import { useMudarSituacao } from '@/hooks/useMudarSituacao';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSetComentario } from '@/hooks/useSetComentario';

const SITUACAO_ENUM: { [key: number]: string } = {
    0: 'Aberto',
    1: 'Em revisão',
    2: 'Aguardando resposta',
    3: 'Fechado'
};

export const PullRequestTable = () => {
    const { data, isLoading } = useGetPullRequests();

    const columns = [
        { key: 'numero', label: 'Número' },
        { key: 'titulo', label: 'Titulo' },
        { key: 'criador', label: 'Criador' },
        { key: 'revisor', label: 'Revisor' },
        { key: 'situacao', label: 'Situação' },
    ];

    if (isLoading || !data) {
        return <></>;
    }

    return (
        <Table style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e1e4e8', borderRadius: '5px' }}>
            <TableThead style={{ backgroundColor: '#f5f5f5' }}>
                <TableTr>
                    {columns.map((column, index) => (
                        <TableTh key={index} style={{ color: '#333', fontWeight: 'bold' }}>
                            {column.label}
                        </TableTh>
                    ))}
                    <TableTh></TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {data.map((row, index) => (
                    <TableTr key={index}>
                        <TableTd>{row.numero}</TableTd>
                        <TableTd>
                            <a href={row.url.startsWith('http://') || row.url.startsWith('https://') ? row.url : `http://${row.url}`}>
                                {row.titulo}
                            </a>
                        </TableTd>
                        <CriadorTd {...row} />
                        <RevisorTd {...row} />
                        <SituacaoTd {...row} />
                        <ActionsTd {...row} />
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    );
};

const SituacaoTd = ({ situacao, id, criador_id, revisor_id }: PullRequest) => {
    const { data } = useGetSession();
    const { mutate } = useMudarSituacao();

    const onSituacaoChange = (value: string | null) => {
        if (value !== null) {
            mutate({ id, situacao: Number(value) });
        }
    };

    if (!data?.session || criador_id != data.session.user.id && revisor_id != data.session.user.id) {
        return <TableTd>{SITUACAO_ENUM[situacao]}</TableTd>;
    }

    return (
        <TableTd>
            <Select
                placeholder="Selecione"
                value={String(situacao)}
                onChange={onSituacaoChange}
                size='xs'
                data={[
                    { value: '0', label: 'Aberto' },
                    { value: '1', label: 'Em revisão' },
                    { value: '2', label: 'Aguardando resposta' },
                    { value: '3', label: 'Fechado' },
                ]}
            />
        </TableTd>
    );
}

const ActionsTd = (props: PullRequest) => {
    const { data } = useGetSession();
    const { criador_id } = props;

    const ehCriador = data?.session && criador_id == data.session.user.id;

    return (
        <TableTd style={{ padding: '0', width: '1%', whiteSpace: 'nowrap', textAlign: 'center' }}>
            <Container style={{ display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
                <ComentarioModal {...props} />
                {ehCriador && <DeleteButton {...props} />}
            </Container>
        </TableTd>
    );
}

const ComentarioModal = ({ id, revisor_id, comentario }: PullRequest) => {
    const { data } = useGetSession();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, getValues } = useForm({ defaultValues: { comentario } });
    const { mutate: setComentario } = useSetComentario();

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleAddComment = () => {
        const { comentario } = getValues();
        setComentario({ id, comentario });
        toggleModal();
    };

    const ehRevisor = data?.session && revisor_id == data.session.user.id;

    return <>
            <Button variant="subtle" onClick={toggleModal}>
                <Icon icon={commentAdd} width="16" height="16" />
            </Button>
            <Modal
                opened={isModalOpen}
                onClose={toggleModal}
                title="Adicione seu comentário"
                size={'xl'}
            >   
                <form onSubmit={handleSubmit(handleAddComment)}>
                    <Textarea
                        placeholder="Digite seu comentário aqui..."
                        size='sm'
                        {...register("comentario")}
                        disabled={!ehRevisor}
                    />
                    {ehRevisor && <Group style={{ justifyContent: "center" }} mt="md">
                        <Button type="submit" style={{
                            background: 'linear-gradient(90deg, #007cf0, #b200df)'
                        }}>Enviar</Button>
                    </Group>}
                </form>
            </Modal>
        </>;
}

const DeleteButton = ({id}: PullRequest) => {
    const { mutate: removePullRequest } = useRemovePullRequest();

    return (
        <Button variant="subtle" onClick={() => removePullRequest(id)}>
            <Icon icon={trashCanOutline} width="16" height="16" />
        </Button>
    );
}

const RevisorTd = ({ revisor_email, revisor_id, revisor_image, criador_id, id }: PullRequest) => {
    const { data } = useGetSession();
    const { mutate: setRevisor } = useSetRevisor();

    const handleSetRevisor = () => {
        if (!data?.session) {
            return;
        }

        setRevisor({ id, revisorData: { revisor_id: data.session.user.id, revisor_email: data.session.user.email, revisor_image: data.session.user.user_metadata?.avatar_url } });
    }

    if (!revisor_id) {
        const disabled = !data?.session || criador_id == data.session.user.id;

        return (
            <TableTd>
                <Button size='compact-sm' disabled={disabled} onClick={() => handleSetRevisor()}>Revisar</Button>
            </TableTd>
        );
    }

    return (
        <TableTd>
            <Container style={{ display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
                {revisor_image && <Avatar src={revisor_image} alt={revisor_image} size={"sm"} />}
                {revisor_email}
            </Container>
        </TableTd>
    );
};

const CriadorTd = ({ criador_email, criador_image }: PullRequest) => {
    return (
        <TableTd>
            <Container style={{ display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
                {criador_image && <Avatar src={criador_image} alt={criador_image} size={"sm"} />}
                {criador_email}
            </Container>
        </TableTd>
    );
};
