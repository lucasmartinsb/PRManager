import { Icon } from '@iconify/react';
import googleIcon from '@iconify-icons/logos/google-icon';
import plusIcon from '@iconify-icons/akar-icons/plus';
import { ActionIcon, ActionIconProps, Center, ContainerProps, Title, Container, Avatar, Button, Notification, Modal, TextInput, Group } from '@mantine/core';
import { PullRequestTable } from '@/components/PullRequestTable';
import { useLoginSocial } from '@/hooks/useLoginSocial';
import { useGetSession } from '@/hooks/useGetSession';
import { useLogout } from '@/hooks/useLogout';
import { Toaster, toast } from 'sonner'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAddPullRequest } from '@/hooks/useAddPullRequest';

export function ListPage() {
  const { data: session, isLoading } = useGetSession();

  const tableContainerProps: ContainerProps = {
    size: 'xxl',
    style: { marginTop: 20 },
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <Toaster position="bottom-right" />
      {session?.session ? <GoogleAccount /> : <LoginButton />}
      <Center>
        <Title
          order={1}
          style={{
            marginTop: 10,
            fontSize: '32px',
            background: 'linear-gradient(90deg, #007cf0, #b200df)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Pull Request Manager
        </Title>
      </Center>
      <Container {...tableContainerProps}>
        <PullRequestTable />
      </Container>
      <AddPrButton />
    </>
  );
}

const AddPrButton = () => {
  const { data: session, isLoading } = useGetSession();
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const { mutate: addPullRequest } = useAddPullRequest();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAddPr = () => {
    if (isLoading || !session?.session) {
      return toast.error("Você precisa estar logado para adicionar um PR", {
        duration: 2000,
      });
    }

    handleOpenModal();
  };

  const onSubmit = () => {
    if (!session?.session?.user.id) {
      return toast.error("Usuário não encontrado", {
        duration: 2000,
      });
    }

    const data = getValues();

    addPullRequest({
      titulo: data.title,
      criador_id: session?.session?.user.id,
      criador_email: session?.session?.user.email,
      criador_image: session?.session?.user.user_metadata?.avatar_url,
      url: data.url,
    })

    setModalOpen(false);
    reset();
  };

  const addButtonStyle: ActionIconProps = {
    pos: 'absolute',
    size: 'lg',
    variant: 'filled',
    style: { 
      bottom: 20, 
      right: 20, 
      border: 0,
      background: 'linear-gradient(90deg, #007cf0, #b200df)',
    },
    w: "64px",
    h: "64px",
  };

  return <>
    <ActionIcon {...addButtonStyle} onClick={handleAddPr}>
      <Icon icon={plusIcon} width="64" height="64" />
    </ActionIcon>
    <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title="Adicionar Pull Request"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Título do PR"
          placeholder="Digite o título do Pull Request"
          {...register("title", { required: true })}
          error={errors.title && "Este campo é obrigatório"}
        />
        <TextInput
          label="Link do PR"
          placeholder="Digite o link do Pull Request"
          {...register("url", { required: true })}
          error={errors.url && "Este campo é obrigatório"}
        />
        <Group style={{ justifyContent: "center" }} mt="md">
          <Button type="submit" style={{
            background: 'linear-gradient(90deg, #007cf0, #b200df)'
          }}>Enviar</Button>
        </Group>
      </form>
    </Modal>
  </>
};

const GoogleAccount = () => {
  const { data: session } = useGetSession();
  const { mutate: logout } = useLogout();

  const googleUserIcon: ContainerProps = {
    pos: 'absolute',
    size: 'lg',
    variant: 'default',
    style: {
      top: 20,
      left: 20, 
      border: 0, 
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 5
    },
  };

  if (!session) return <></>;

  const imageUrl = session.session?.user?.user_metadata?.avatar_url || '';

  return (
    <Container {...googleUserIcon}>
      <Avatar src={imageUrl} alt="Google Account Avatar" />
      <Button variant="filled" color="red" size="xs" radius="xl" onClick={() => logout()}>Loggout</Button>
    </Container>
  );
}

const LoginButton = () => {
  const { mutate: handleLogin } = useLoginSocial();

  const googleIconStyle: ActionIconProps = {
    pos: 'absolute',
    size: 'lg',
    variant: 'default',
    style: { top: 20, left: 20, border: 0 },
  };

  return (
    <ActionIcon {...googleIconStyle} onClick={() => handleLogin()}>
      <Icon icon={googleIcon} width="32" height="32" />
    </ActionIcon>
  );
};
