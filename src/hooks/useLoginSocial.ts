import { useMutation } from 'react-query';
import { supabase } from '../supabaseClient';

async function signInWithProvider() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })

    if (error) throw error;

    return data;
}

export function useLoginSocial() {
    return useMutation(signInWithProvider);
}