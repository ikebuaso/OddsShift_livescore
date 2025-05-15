import { createClient } from '@supabase/supabase-js';
import type { Match, Favorite, Notification } from '../types';
import { createClient } from '@supabase/supabase-js';
// Initialize Supabase client
// In a production app, these would be environment variables
const supabaseUrl = 'https://mjtpiwbhihfvbtybgqul.supabase.co';
const supabaseAnonKey = 'process.env.SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the Supabase client instance
export { supabase };

// Auth functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Match functions
export const getMatches = async (filter?: string): Promise<Match[]> => {
  let query = supabase.from('matches').select('*');
  
  if (filter) {
    query = query.eq('league', filter);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  
  return data as Match[];
};

export const getLiveMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('status', 'live');
  
  if (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
  
  return data as Match[];
};

export const getUpcomingMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('status', 'upcoming')
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }
  
  return data as Match[];
};

// Favorites functions
export const getFavoriteTeams = async (userId: string): Promise<Favorite[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching favorite teams:', error);
    return [];
  }
  
  return data as Favorite[];
};

export const addFavoriteTeam = async (userId: string, teamName: string): Promise<boolean> => {
  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, team_name: teamName }]);
  
  if (error) {
    console.error('Error adding favorite team:', error);
    return false;
  }
  
  return true;
};

export const removeFavoriteTeam = async (favoriteId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId);
  
  if (error) {
    console.error('Error removing favorite team:', error);
    return false;
  }
  
  return true;
};

// Notifications functions
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  
  return data as Notification[];
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  
  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
  
  return true;
};

// Search function
export const searchTeams = async (query: string): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`home_team.ilike.%${query}%,away_team.ilike.%${query}%`);
  
  if (error) {
    console.error('Error searching teams:', error);
    return [];
  }
  
  return data as Match[];
};