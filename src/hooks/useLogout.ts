import { useMutation } from 'react-query';
import { supabase } from '../supabaseClient';
import { useGetSession } from './useGetSession';

async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) throw error;

    return true;
}

export function useLogout() {
    const { refetch } = useGetSession();

    return useMutation(signOut, {
        onSuccess: () => {
            refetch();
        }
    });
}