import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Connection } from '../services/connections';

export const useRealtimeConnections = (userId: string) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Initial load
    const loadConnections = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('connections')
          .select(`
            *,
            requester_profile:profiles!connections_requester_id_fkey(
              id,
              full_name,
              role,
              company,
              avatar_url
            ),
            responder_profile:profiles!connections_responder_id_fkey(
              id,
              full_name,
              role,
              company,
              avatar_url
            ),
            opportunity:opportunities(
              id,
              title,
              company
            )
          `)
          .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match UI expectations
        const transformedConnections = (data || []).map(connection => {
          const isRequester = connection.requester_id === userId;
          const otherUser = isRequester ? connection.responder_profile : connection.requester_profile;
          
          return {
            ...connection,
            user_id: userId,
            connected_user_id: isRequester ? connection.responder_id : connection.requester_id,
            connected_user: otherUser ? {
              id: otherUser.id,
              name: otherUser.full_name,
              role: otherUser.role,
              company: otherUser.company,
              profile_image: otherUser.avatar_url
            } : undefined,
            status: connection.status === 'accepted' ? 'active' : 
                    connection.status === 'rejected' ? 'declined' : 
                    connection.status === 'pending' ? 'pending' : 'declined'
          };
        });

        setConnections(transformedConnections);
      } catch (err) {
        setError('Failed to load connections');
        console.error('Error loading connections:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConnections();

    // Set up real-time subscription
    const subscription = supabase
      .channel('connections_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `requester_id=eq.${userId} OR responder_id=eq.${userId}`
        },
        (payload) => {
          console.log('Connection change detected:', payload);
          
          // Reload connections when there's a change
          loadConnections();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { connections, loading, error, refetch: () => setLoading(true) };
}; 