import React, { useState } from 'react';
import MatchCard from './MatchCard';
import { Filter } from 'lucide-react';
import type { Match, Favorite } from '../../types';

interface MatchListProps {
  matches: Match[];
  title: string;
  isLoading: boolean;
  favorites?: Favorite[];
  onToggleFavorite?: (teamName: string) => void;
  isAuthenticated: boolean;
}

const MatchList: React.FC<MatchListProps> = ({ 
  matches, 
  title, 
  isLoading, 
  favorites = [], 
  onToggleFavorite,
  isAuthenticated 
}) => {
  const [leagueFilter, setLeagueFilter] = useState<string | null>(null);
  
  // Get unique leagues
  const leagues = Array.from(new Set(matches.map(match => match.league)));
  
  // Filter matches by league if a filter is set
  const filteredMatches = leagueFilter
    ? matches.filter(match => match.league === leagueFilter)
    : matches;
  
  // Check if a team is in favorites
  const isTeamFavorite = (teamName: string) => {
    return favorites.some(fav => fav.team_name === teamName);
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C4B33]"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading matches...</p>
      </div>
    );
  }

  if (filteredMatches.length === 0) {
    return (
      <div className="py-12">
        <p className="text-center text-gray-600">No matches found.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        
        {leagues.length > 0 && (
          <div className="relative">
            <select
              value={leagueFilter || ''}
              onChange={(e) => setLeagueFilter(e.target.value || null)}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4B33] focus:border-[#2C4B33]"
            >
              <option value="">All Leagues</option>
              {leagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            isFavorite={isTeamFavorite(match.home_team) || isTeamFavorite(match.away_team)}
            onToggleFavorite={() => {
              if (onToggleFavorite) {
                const teamToToggle = isTeamFavorite(match.home_team) ? match.home_team : match.away_team;
                onToggleFavorite(teamToToggle);
              }
            }}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchList;