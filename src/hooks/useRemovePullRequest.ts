import { useMutation } from 'react-query';
import { supabase } from '../supabaseClient';
import { useGetPullRequests } from './useGetPullRequests';

async function removePullRequest(id: string) {
    const { data, error } = await supabase
        .from('pull_requests')
        .delete()
        .match({ id });

    if (error) throw new Error(error.message);
    return data;
}

export function useRemovePullRequest() {
    const { refetch } = useGetPullRequests();

    return useMutation(removePullRequest, {
        onSuccess: () => {
            refetch();
        }
    });
}