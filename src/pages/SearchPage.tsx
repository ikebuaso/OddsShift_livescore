import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import MatchList from '../components/matches/MatchList';
import EmptyState from '../components/matches/EmptyState';
import { searchTeams, getFavoriteTeams, addFavoriteTeam, removeFavoriteTeam } from '../lib/supabase';
import type { Match, Favorite } from '../types';

interface SearchPageProps {
  user: any | null;
}

const SearchPage: React.FC<SearchPageProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const matchesData = await searchTeams(query);
        setMatches(matchesData);
        
        if (user) {
          const favoritesData = await getFavoriteTeams(user.id);
          setFavorites(favoritesData);
        }
      } catch (err) {
        console.error('Error searching teams:', err);
        setError('Failed to search teams. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, user]);

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
      <PageContainer title={`Search Results: ${query}`}>
        <EmptyState type="error" message={error} />
      </PageContainer>
    );
  }
  
  if (!query) {
    return (
      <PageContainer title="Search">
        <EmptyState 
          type="search" 
          message="Please enter a search term to find matches with specific teams." 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`Search Results: ${query}`}>
      {!loading && matches.length === 0 ? (
        <EmptyState 
          type="search" 
          message={`No matches found for "${query}". Try a different search term.`} 
        />
      ) : (
        <MatchList
          matches={matches}
          title={`Search Results for "${query}"`}
          isLoading={loading}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          isAuthenticated={!!user}
        />
      )}
    </PageContainer>
  );
};

export default SearchPage;