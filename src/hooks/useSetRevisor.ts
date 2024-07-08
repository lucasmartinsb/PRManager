import { useMutation } from 'react-query';
import { supabase } from '../supabaseClient';
import { useGetPullRequests } from './useGetPullRequests';

interface RevisorData {
    revisor_id: string;
    revisor_image?: string;
    revisor_email?: string;
}

async function setRevisor(id: number, revisorData: RevisorData) {
    const { data, error } = await supabase
        .from('pull_requests')
        .update(revisorData)
        .match({ id });

    if (error) throw new Error(error.message);

    return data;
}

export function useSetRevisor() {
    const { refetch } = useGetPullRequests();

    return useMutation(({ id, revisorData }: { id: string; revisorData: RevisorData }) => setRevisor(id, revisorData), {
        onSuccess: () => {
            refetch();
        }
    });
}