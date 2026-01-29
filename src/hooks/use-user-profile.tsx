import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/integrations/supabase/auth';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  academy_level: number;
  best_note: number;
  ranking_position: number;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means 'No rows found'
    throw new Error(error.message);
  }

  return data as UserProfile | null;
};

export const useUserProfile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery<UserProfile | null, Error>({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId, // Only run query if userId exists
    initialData: null,
  });
};