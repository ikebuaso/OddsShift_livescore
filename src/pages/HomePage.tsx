import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import MatchList from '../components/matches/MatchList';
import EmptyState from '../components/matches/EmptyState';
import { getLiveMatches, getUpcomingMatches, getFavoriteTeams, addFavoriteTeam, removeFavoriteTeam } from '../lib/supabase';
import type { Match, Favorite } from '../types';

interface HomePageProps {
  user: any | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveData, upcomingData] = await Promise.all([
          getLiveMatches(),
          getUpcomingMatches()
        ]);
        
        setLiveMatches(liveData);
        setUpcomingMatches(upcomingData.slice(0, 6)); // Show only next 6 upcoming matches
        
        if (user) {
          const favoritesData = await getFavoriteTeams(user.id);
          setFavorites(favoritesData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Simulated real-time updates - in a real app, you'd use Supabase subscription
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
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
      <PageContainer>
        <EmptyState type="error" message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <section>
          <MatchList
            matches={liveMatches}
            title="Live Matches"
            isLoading={loading}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isAuthenticated={!!user}
          />
        </section>
        
        <section>
          <MatchList
            matches={upcomingMatches}
            title="Upcoming Matches"
            isLoading={loading}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isAuthenticated={!!user}
          />
        </section>
      </div>
    </PageContainer>
  );
};

export default HomePage;