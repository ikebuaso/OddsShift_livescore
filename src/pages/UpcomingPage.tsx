import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import MatchList from '../components/matches/MatchList';
import EmptyState from '../components/matches/EmptyState';
import { getUpcomingMatches, getFavoriteTeams, addFavoriteTeam, removeFavoriteTeam } from '../lib/supabase';
import type { Match, Favorite } from '../types';

interface UpcomingPageProps {
  user: any | null;
}

const UpcomingPage: React.FC<UpcomingPageProps> = ({ user }) => {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchesData = await getUpcomingMatches();
        setUpcomingMatches(matchesData);
        
        if (user) {
          const favoritesData = await getFavoriteTeams(user.id);
          setFavorites(favoritesData);
        }
      } catch (err) {
        console.error('Error fetching upcoming matches:', err);
        setError('Failed to load upcoming matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleToggleFavorite = async (teamName: string) => {
    if (!user) return;
    
    try {
      const existingFavorite = favorites.find(fav => fav.team_name === teamName);
      
      if (existingFavorite) {
        await removeFavoriteTeam(existingFavorite.id);
        setFavorites(favorites.filter(fav => fav.id !== existingFavorite.id));
      } else {
        const success = await addFavoriteTeam(user.id, teamName);
        if (success) {
          // Refetch favorites to get the new ID
          const favoritesData = await getFavoriteTeams(user.id);
          setFavorites(favoritesData);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (error) {
    return (
      <PageContainer title="Upcoming Matches">
        <EmptyState type="error" message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Upcoming Matches">
      <MatchList
        matches={upcomingMatches}
        title="All Upcoming Matches"
        isLoading={loading}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        isAuthenticated={!!user}
      />
    </PageContainer>
  );
};

export default UpcomingPage;