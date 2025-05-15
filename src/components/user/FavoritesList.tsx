import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import type { Favorite } from '../../types';

interface FavoritesListProps {
  favorites: Favorite[];
  onRemove: (id: string) => void;
  isLoading: boolean;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onRemove, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2C4B33]"></div>
        <span className="ml-2 text-gray-600">Loading favorites...</span>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Star size={32} className="mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Favorite Teams</h3>
        <p className="text-gray-500">
          You haven't added any teams to your favorites yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-[#2C4B33] text-white">
        <h3 className="text-lg font-medium">My Favorite Teams</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {favorites.map((favorite) => (
          <li key={favorite.id} className="px-4 py-3 hover:bg-gray-50 transition duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-yellow-500 mr-2" />
                <span className="text-gray-800">{favorite.team_name}</span>
              </div>
              <button
                onClick={() => onRemove(favorite.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-150"
                title="Remove from favorites"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;