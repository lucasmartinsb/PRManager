import { useMutation } from 'react-query';
import { supabase } from '../supabaseClient';
import { useGetPullRequests } from './useGetPullRequests';

interface PullRequestData {
    titulo: string;
    criador_id: string;
    criador_email?: string;
    criador_image?: string;
    url: string;
}

async function addPullRequest(prData: PullRequestData) {
    const { data, error } = await supabase
      .from('pull_requests')
      .insert([{
        ...prData,
        situacao: 0,
      }]);

    if (error) throw new Error(error.message);

    return data;
  }

export function useAddPullRequest() {
    const { refetch } = useGetPullRequests();

    return useMutation(addPullRequest, {
        onSuccess: () => {
            refetch();
        }
    });
}