import React from 'react';
import { format } from 'date-fns';
import { Star, Clock, AlertCircle } from 'lucide-react';
import type { Match } from '../../types';

interface MatchCardProps {
  match: Match;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isAuthenticated: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  isFavorite = false, 
  onToggleFavorite, 
  isAuthenticated 
}) => {
  const { league, home_team, away_team, score_home, score_away, start_time, status, odds } = match;
  
  const formatMatchTime = (time: string) => {
    const date = new Date(time);
    return format(date, 'HH:mm');
  };
  
  const formatMatchDate = (time: string) => {
    const date = new Date(time);
    return format(date, 'dd MMM yyyy');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
      <div className="bg-[#2C4B33] text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium">{league}</span>
        </div>
        {status === 'live' && (
          <div className="flex items-center">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
            <span className="text-xs font-medium">LIVE</span>
          </div>
        )}
        {status === 'upcoming' && (
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span className="text-xs font-medium">{formatMatchTime(start_time)}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <span className="font-medium text-gray-800">{home_team}</span>
              {isAuthenticated && (
                <button 
                  onClick={onToggleFavorite}
                  className="ml-2 text-gray-400 hover:text-yellow-500 focus:outline-none"
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star size={16} className={isFavorite ? "fill-yellow-500 text-yellow-500" : ""} />
                </button>
              )}
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-800">{away_team}</span>
              {isAuthenticated && (
                <button 
                  onClick={onToggleFavorite}
                  className="ml-2 text-gray-400 hover:text-yellow-500 focus:outline-none"
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star size={16} className={isFavorite ? "fill-yellow-500 text-yellow-500" : ""} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {status === 'live' || status === 'finished' ? (
              <>
                <span className="font-bold text-xl text-gray-800">{score_home}</span>
                <span className="font-bold text-xl text-gray-800">{score_away}</span>
              </>
            ) : (
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">{formatMatchDate(start_time)}</div>
                <div className="text-sm font-medium text-gray-700">{formatMatchTime(start_time)}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Odds Section */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs">
            <div className="flex flex-col items-center">
              <span className="text-gray-500 mb-1">1</span>
              <span className="font-medium">{odds.home.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500 mb-1">X</span>
              <span className="font-medium">{odds.draw.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500 mb-1">2</span>
              <span className="font-medium">{odds.away.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;