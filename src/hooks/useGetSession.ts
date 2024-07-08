import { useQuery } from 'react-query';
import { supabase } from '../supabaseClient';

async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data;
}

export function useGetSession() {
    return useQuery('session', getSession);
}