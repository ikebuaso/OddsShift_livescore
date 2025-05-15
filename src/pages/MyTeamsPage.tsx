import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import FavoritesList from '../components/user/FavoritesList';
import NotificationList from '../components/user/NotificationList';
import { getFavoriteTeams, removeFavoriteTeam, getNotifications, markNotificationAsRead } from '../lib/supabase';
import type { Favorite, Notification } from '../types';

interface MyTeamsPageProps {
  user: any | null;
}

const MyTeamsPage: React.FC<MyTeamsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch favorites
        setLoadingFavorites(true);
        const favoritesData = await getFavoriteTeams(user.id);
        setFavorites(favoritesData);
        setLoadingFavorites(false);
        
        // Fetch notifications
        setLoadingNotifications(true);
        const notificationsData = await getNotifications(user.id);
        setNotifications(notificationsData);
        setLoadingNotifications(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoadingFavorites(false);
        setLoadingNotifications(false);
      }
    };
    
    fetchData();
  }, [user, navigate]);

  const handleRemoveFavorite = async (id: string) => {
    try {
      const success = await removeFavoriteTeam(id);
      if (success) {
        setFavorites(favorites.filter(fav => fav.id !== id));
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        ));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <PageContainer title="My Teams">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <FavoritesList 
            favorites={favorites} 
            onRemove={handleRemoveFavorite} 
            isLoading={loadingFavorites} 
          />
        </div>
        
        <div>
          <NotificationList 
            notifications={notifications} 
            onMarkAsRead={handleMarkNotificationAsRead} 
            isLoading={loadingNotifications} 
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default MyTeamsPage;