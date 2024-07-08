import { useQuery } from 'react-query';
import { supabase } from '../supabaseClient';

export interface PullRequest {
    id: string;
    numero: number;
    titulo: string;
    criador_id: string;
    criador_email?: string;
    criador_image?: string;
    revisor_id?: string;
    revisor_email?: string;
    revisor_image?: string;
    url: string;
    situacao: number;
    comentario: string,
    created_at: string;
}

async function fetchPullRequests(): Promise<PullRequest[]> {
  const { data, error } = await supabase
    .from('pull_requests')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useGetPullRequests() {
  return useQuery<PullRequest[], Error>('pullRequests', fetchPullRequests);
}