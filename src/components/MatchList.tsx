import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Match = Database['public']['Tables']['matches']['Row'];

export default function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        console.log('Fetching matches from Supabase...');
        const { data, error: supabaseError } = await supabase
          .from('matches')
          .select('*')
          .order('start_time', { ascending: true });

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw supabaseError;
        }

        console.log('Matches fetched successfully:', data?.length ?? 0, 'matches');
        setMatches(data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Upcoming Matches</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {match.league}
              </span>
              <span className={`text-sm font-medium ${
                match.status === 'live' ? 'text-red-500' :
                match.status === 'finished' ? 'text-green-500' :
                'text-blue-500'
              }`}>
                {match.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{match.home_team}</span>
                <span className="text-xl font-bold">{match.score_home ?? '-'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">{match.away_team}</span>
                <span className="text-xl font-bold">{match.score_away ?? '-'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  {new Date(match.start_time).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <div className="flex gap-2">
                  <span>H: {match.odds.home}</span>
                  <span>D: {match.odds.draw}</span>
                  <span>A: {match.odds.away}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}