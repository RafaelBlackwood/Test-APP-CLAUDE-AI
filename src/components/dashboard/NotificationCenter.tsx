import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import type { Notification, NotificationType } from '../../types';

interface NotificationCenterProps {
  notifications: Notification[];
  isLoading?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
  onClearAll?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  const iconProps = { className: 'w-5 h-5' };
  
  switch (type) {
    case 'application_update':
      return <CheckCircleIcon {...iconProps} className="w-5 h-5 text-primary-600" />;
    case 'deadline_reminder':
      return <ClockIcon {...iconProps} className="w-5 h-5 text-warning-600" />;
    case 'recommendation_request':
      return <InformationCircleIcon {...iconProps} className="w-5 h-5 text-blue-600" />;
    case 'system_announcement':
      return <BellIconSolid {...iconProps} className="w-5 h-5 text-purple-600" />;
    case 'document_verified':
      return <CheckIcon {...iconProps} className="w-5 h-5 text-success-600" />;
    case 'interview_scheduled':
      return <ExclamationTriangleIcon {...iconProps} className="w-5 h-5 text-orange-600" />;
    default:
      return <InformationCircleIcon {...iconProps} className="w-5 h-5 text-gray-600" />;
  }
};

const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    application_update: 'border-l-primary-500 bg-primary-50',
    deadline_reminder: 'border-l-warning-500 bg-warning-50',
    recommendation_request: 'border-l-blue-500 bg-blue-50',
    system_announcement: 'border-l-purple-500 bg-purple-50',
    document_verified: 'border-l-success-500 bg-success-50',
    interview_scheduled: 'border-l-orange-500 bg-orange-50',
  };
  return colors[type] || 'border-l-gray-500 bg-gray-50';
};

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

const NotificationItem: React.FC<{
  notification: Notification;
  index: number;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}> = ({ notification, index, onMarkAsRead, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`border-l-4 rounded-r-lg transition-all duration-200 cursor-pointer ${
        notification.read ? 'opacity-75' : ''
      } ${getNotificationColor(notification.type)}`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4
                className={`font-medium ${
                  notification.read ? 'text-gray-600' : 'text-gray-900'
                }`}
              >
                {notification.title}
              </h4>
              
              <div className="flex items-center space-x-1 ml-2">
                <span className="text-xs text-gray-500">
                  {getTimeAgo(notification.createdAt)}
                </span>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </div>
            </div>
            
            <p
              className={`text-sm mb-2 ${
                notification.read ? 'text-gray-500' : 'text-gray-700'
              }`}
            >
              {notification.message}
            </p>
            
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Details →
              </a>
            )}
          </div>
        </div>
        
        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-200"
            >
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead?.(notification.id);
                  }}
                  className="flex items-center px-2 py-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <EyeIcon className="w-3 h-3 mr-1" />
                  Mark as read
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(notification.id);
                }}
                className="flex items-center px-2 py-1 text-xs text-gray-500 hover:text-error-600 transition-colors"
              >
                <TrashIcon className="w-3 h-3 mr-1" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="border-l-4 border-l-gray-200 bg-gray-50 rounded-r-lg p-4 animate-pulse">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-gray-200 rounded mt-0.5"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    read: notifications.filter(n => n.read).length,
  };

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const sortedDates = Object.keys(groupedNotifications).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <BellIcon className="w-6 h-6 text-gray-700" />
              {stats.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.unread > 9 ? '9+' : stats.unread}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-gray-600">Stay updated with important alerts</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {stats.unread > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Mark all as read
              </button>
            )}
            {stats.total > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-gray-500 hover:text-error-600 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary-600">{stats.unread}</div>
            <div className="text-xs text-gray-500">Unread</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">{stats.read}</div>
            <div className="text-xs text-gray-500">Read</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'unread', label: 'Unread', count: stats.unread },
            { key: 'read', label: 'Read', count: stats.read },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
                </p>
                <p className="text-sm text-gray-400">
                  {filter === 'unread' ? 'You\'re all caught up!' : 'Try adjusting your filter'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map(date => {
                  const dateNotifications = groupedNotifications[date];
                  const isToday = new Date().toDateString() === date;
                  const isYesterday = new Date(Date.now() - 86400000).toDateString() === date;
                  
                  let dateLabel = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  });
                  
                  if (isToday) dateLabel = 'Today';
                  else if (isYesterday) dateLabel = 'Yesterday';
                  
                  return (
                    <div key={date}>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 sticky top-0 bg-white py-2">
                        {dateLabel}
                      </h3>
                      <div className="space-y-3">
                        {dateNotifications
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((notification, index) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              index={index}
                              onMarkAsRead={onMarkAsRead}
                              onDelete={onDelete}
                            />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationCenter;