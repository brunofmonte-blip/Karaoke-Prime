import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { onAuthStateChanged, auth } from '@/lib/auth';

/**
 * Diz se o usuário logado tem assinatura ativa.
 * A fonte da verdade é a coluna profiles.is_prime, que SÓ o servidor
 * (webhook do Stripe) consegue alterar.
 */
export function useIsPremium(): { isPremium: boolean; isLoading: boolean } {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (!cancelled) { setIsPremium(false); setIsLoading(false); }
        return;
      }
      const { data } = await supabase.from('profiles').select('is_prime').eq('id', user.id).maybeSingle();
      if (!cancelled) {
        setIsPremium(Boolean(data?.is_prime));
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  return { isPremium, isLoading };
}
