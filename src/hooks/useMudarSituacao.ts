import { useMutation } from 'react-query';
import { supabase } from '../supabaseClient';
import { useGetPullRequests } from './useGetPullRequests';

async function setSituacao(id: string, situacao: number) {
    const { data, error } = await supabase
        .from('pull_requests')
        .update({ situacao })
        .match({ id });

    if (error) throw new Error(error.message);

    return data;
}

export function useMudarSituacao() {
    const { refetch } = useGetPullRequests();

    return useMutation(({ id, situacao }: { id: string; situacao: number }) => setSituacao(id, situacao), {
        onSuccess: () => {
            refetch();
        }
    });
}