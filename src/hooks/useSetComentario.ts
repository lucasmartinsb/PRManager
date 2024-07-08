import { useMutation } from 'react-query';
import { supabase } from '../supabaseClient';
import { useGetPullRequests } from './useGetPullRequests';

async function setComentario(id: string, comentario: string) {
    const { data, error } = await supabase
        .from('pull_requests')
        .update({ comentario })
        .match({ id });

    if (error) throw new Error(error.message);

    return data;
}

export function useSetComentario() {
    const { refetch } = useGetPullRequests();

    return useMutation(({ id, comentario }: { id: string; comentario: string }) => setComentario(id, comentario), {
        onSuccess: () => {
            refetch();
        }
    });
}