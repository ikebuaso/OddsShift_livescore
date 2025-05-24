import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Favorite } from '../types/database';
import { Star, Trash2 } from 'lucide-react';

function MyTeams() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      fetchFavorites();
    };

    checkUser();
  }, [navigate]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*');

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorite teams');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.trim()) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{ team_name: newTeam.trim() }]);

      if (error) throw error;
      setNewTeam('');
      fetchFavorites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add team');
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchFavorites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove team');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8">My Teams</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={addFavorite} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            placeholder="Enter team name"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Add Team
          </button>
        </div>
      </form>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">You haven't added any favorite teams yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">{favorite.team_name}</span>
              </div>
              <button
                onClick={() => removeFavorite(favorite.id)}
                className="text-gray-400 hover:text-red-500 focus:outline-none"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTeams;