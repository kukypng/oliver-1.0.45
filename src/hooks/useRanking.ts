import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RankingEntry {
  id: string;
  user_name: string;
  score: number;
  created_at: string;
}

export const useRanking = () => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rankings
  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .rpc('get_top_rankings');

      if (error) throw error;
      
      setRankings(data || []);
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch rankings');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new score (now using authenticated user)
  const submitScore = async (score: number): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('ranking_invaders')
        .insert([
          {
            user_id: user.id,
            score: score
          }
        ]);

      if (error) throw error;
      
      // Refresh rankings after successful submission
      await fetchRankings();
    } catch (err) {
      console.error('Error submitting score:', err);
      throw err;
    }
  };

  // Set up real-time subscription for ranking updates
  useEffect(() => {
    fetchRankings();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('ranking-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ranking_invaders'
        },
        () => {
          fetchRankings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    rankings,
    isLoading,
    error,
    submitScore,
    refetch: fetchRankings
  };
};