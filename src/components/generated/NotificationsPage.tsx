"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Filter, 
  X, 
  Trash2, 
  Check, 
  Users, 
  Briefcase, 
  FileText, 
  Mail, 
  Settings,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications(user?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply status filter
    if (selectedFilter === 'unread') {
      filtered = filtered.filter(notification => !notification.is_read);
    } else if (selectedFilter === 'read') {
      filtered = filtered.filter(notification => notification.is_read);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [notifications, selectedFilter, searchQuery]);

  // Toggle notification selection
  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Select all notifications
  const selectAllNotifications = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  // Bulk delete notifications
  const bulkDeleteNotifications = async () => {
    for (const notificationId of selectedNotifications) {
      await deleteNotification(notificationId);
    }
    setSelectedNotifications([]);
  };

  // Bulk mark as read
  const bulkMarkAsRead = async () => {
    for (const notificationId of selectedNotifications) {
      await markAsRead(notificationId);
    }
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return <Users size={20} className="text-blue-600" />;
      case 'opportunity_grab':
        return <Briefcase size={20} className="text-green-600" />;
      case 'questionnaire_sent':
        return <FileText size={20} className="text-purple-600" />;
      case 'contact_shared':
        return <Mail size={20} className="text-orange-600" />;
      case 'opportunity_update':
        return <Briefcase size={20} className="text-indigo-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getNotificationLink = (notification: any) => {
    switch (notification.type) {
      case 'connection_request':
        return '/connections';
      case 'opportunity_grab':
        return `/opportunities/${notification.data?.opportunity_id}/review`;
      case 'questionnaire_sent':
        return `/questionnaire/respond/${notification.data?.questionnaire_id}`;
      case 'contact_shared':
        return '/connections';
      case 'opportunity_update':
        return `/opportunities/${notification.data?.opportunity_id}`;
      default:
        return '#';
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-300" />
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Notifications</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Notifications
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
              Stay updated with your latest activities and connections.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-gray-50 p-6 border-2 border-gray-200 text-center">
              <Bell size={32} className="mx-auto mb-2 text-gray-600" />
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-gray-600">Total Notifications</div>
            </div>
            <div className="bg-blue-50 p-6 border-2 border-blue-200 text-center">
              <Clock size={32} className="mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="text-gray-600">Unread</div>
            </div>
            <div className="bg-green-50 p-6 border-2 border-green-200 text-center">
              <CheckCircle size={32} className="mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
              <div className="text-gray-600">Read</div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search notifications..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200"
                />
              </div>

              {/* Filter */}
              <select 
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value as any)}
                className="px-6 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              {/* Actions */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="px-6 py-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-10"
                  >
                    Mark All Read
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 mb-6"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">
                    {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                  </span>
                  <button 
                    onClick={clearSelection}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={bulkMarkAsRead}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Mark as Read
                  </button>
                  <button 
                    onClick={bulkDeleteNotifications}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </section>

          {/* Notifications List */}
          <section>
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Bell size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-2xl font-bold mb-4">No notifications found</h3>
                <p className="text-gray-600">
                  {searchQuery || selectedFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'You\'re all caught up! We\'ll notify you when something important happens.'
                  }
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 ${
                      !notification.is_read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        className="mt-2"
                      />

                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold mb-2 ${
                              !notification.is_read ? 'text-black' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 mb-3 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatTimeAgo(notification.created_at)}</span>
                              {!notification.is_read && (
                                <span className="text-blue-600 font-medium">• Unread</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 mt-4">
                          <Link
                            to={getNotificationLink(notification)}
                            className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                          >
                            View details
                          </Link>
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-600 hover:text-black transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage; 