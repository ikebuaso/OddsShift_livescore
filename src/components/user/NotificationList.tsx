import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check } from 'lucide-react';
import type { Notification } from '../../types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  isLoading: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2C4B33]"></div>
        <span className="ml-2 text-gray-600">Loading notifications...</span>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Bell size={32} className="mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Notifications</h3>
        <p className="text-gray-500">
          You're all caught up! No new notifications at the moment.
        </p>
      </div>
    );
  }

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'goal':
        return 'Goal scored in a match you\'re following!';
      case 'start':
        return 'A match you\'re following has started!';
      case 'end':
        return 'A match you\'re following has ended!';
      case 'upcoming':
        return 'A match with your favorite team is starting soon!';
      default:
        return 'You have a new notification!';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-[#2C4B33] text-white">
        <h3 className="text-lg font-medium">Latest Notifications</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li 
            key={notification.id} 
            className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
              !notification.read ? 'bg-green-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-gray-800 ${!notification.read ? 'font-medium' : ''}`}>
                  {getNotificationMessage(notification)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 text-gray-400 hover:text-green-500 rounded-full hover:bg-green-50 transition-colors duration-150"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;