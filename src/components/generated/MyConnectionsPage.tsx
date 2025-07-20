"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, User, Building, Calendar, Eye, UserX, Check, X, Clock, AlertCircle, Users, CheckCircle, XCircle, RotateCcw, Send, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { connectionsService, Connection, ConnectionStats } from '../../services/connections';
import { useRealtimeConnections } from '../../hooks/useRealtimeConnections';

// Simple toast notification component
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X size={16} />
      </button>
    </div>
  </motion.div>
);

const MyConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'declined'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [stats, setStats] = useState<ConnectionStats>({ active: 0, pending: 0, declined: 0 });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Use real-time connections hook
  const { connections, loading, error, refetch } = useRealtimeConnections(user?.id || '');

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Load stats data
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        const statsData = await connectionsService.getConnectionStats(user.id);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading connection stats:', err);
      }
    };

    loadStats();
  }, [user, connections]); // Re-run when connections change
  // Filter connections based on active tab and search
  const filteredConnections = useMemo(() => {
    let filtered = connections.filter(connection => connection.status === activeTab);
    if (searchQuery) {
      filtered = filtered.filter(connection => 
        connection.connected_user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        connection.connected_user?.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
        connection.opportunity?.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [activeTab, searchQuery, connections]);

  // Handle actions
  const handleRevokeAccess = async (connectionId: string) => {
    try {
      setActionLoading(connectionId);
      await connectionsService.revokeAccess(connectionId);
      setShowRevokeModal(null);
      showToast('Access revoked successfully', 'success');
      // Real-time updates will handle the refresh automatically
    } catch (err) {
      console.error('Error revoking access:', err);
      showToast('Failed to revoke access', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShareContact = async (connectionId: string) => {
    try {
      setActionLoading(connectionId);
      await connectionsService.shareContact(connectionId);
      showToast('Contact shared successfully', 'success');
      // Real-time updates will handle the refresh automatically
    } catch (err) {
      console.error('Error sharing contact:', err);
      showToast('Failed to share contact', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendQuestionnaire = async (connectionId: string) => {
    try {
      setActionLoading(connectionId);
      // You would need to get the questionnaire ID from somewhere
      const questionnaireId = 'default-questionnaire-id'; // This should come from props or state
      await connectionsService.sendQuestionnaire(connectionId, questionnaireId);
      showToast('Questionnaire sent successfully', 'success');
      // Real-time updates will handle the refresh automatically
    } catch (err) {
      console.error('Error sending questionnaire:', err);
      showToast('Failed to send questionnaire', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    try {
      setActionLoading(connectionId);
      const reason = 'Declined by user'; // You could make this configurable
      await connectionsService.declineConnection(connectionId, reason);
      setShowDeclineModal(null);
      showToast('Connection declined successfully', 'success');
      // Real-time updates will handle the refresh automatically
    } catch (err) {
      console.error('Error declining request:', err);
      showToast('Failed to decline connection', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReconsider = async (connectionId: string) => {
    try {
      setActionLoading(connectionId);
      await connectionsService.reconsiderConnection(connectionId);
      showToast('Connection reconsidered successfully', 'success');
      // Real-time updates will handle the refresh automatically
    } catch (err) {
      console.error('Error reconsidering connection:', err);
      showToast('Failed to reconsider connection', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProfile = (connectionId: string) => {
    // Navigate to profile detail view
    window.location.href = `/profiles/${connectionId}`;
  };

  const handleBulkAction = async (action: string) => {
    try {
      for (const connectionId of selectedConnections) {
        setActionLoading(connectionId);
        switch (action) {
          case 'share':
            await connectionsService.shareContact(connectionId);
            break;
          case 'revoke':
            await connectionsService.revokeAccess(connectionId);
            break;
          case 'decline':
            await connectionsService.declineConnection(connectionId, 'Bulk declined');
            break;
        }
      }
      setSelectedConnections([]);
      showToast('Bulk action completed successfully', 'success');
      // Real-time updates will handle the refresh automatically
    } catch (err) {
      console.error('Error performing bulk action:', err);
      showToast('Failed to perform bulk action', 'error');
    } finally {
      setActionLoading(null);
    }
  };
  const toggleConnectionSelection = (connectionId: string) => {
    setSelectedConnections(prev => prev.includes(connectionId) ? prev.filter(id => id !== connectionId) : [...prev, connectionId]);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const getPriorityLevel = (waitingDays?: number) => {
    if (!waitingDays) return 'normal';
    if (waitingDays >= 7) return 'high';
    if (waitingDays >= 3) return 'medium';
    return 'normal';
  };
  return (
    <>
      {/* Stats Summary */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.1
      }} className="mb-8">
        <div className="bg-gray-50 p-6 border-l-4 border-black">
          <p className="text-lg font-medium">
            <span className="font-bold">{stats.active}</span> Active Connections, 
            <span className="font-bold text-orange-600 ml-2">{stats.pending}</span> Pending, 
            <span className="font-bold text-gray-600 ml-2">{stats.declined}</span> Declined
          </p>
        </div>
      </motion.div>

          {/* Search and Filter Bar */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search connections..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition-colors" />
              </div>
              
              {selectedConnections.length > 0 && <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedConnections.length} selected
                  </span>
                  <button onClick={() => handleBulkAction('revoke')} className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
                    Bulk Revoke
                  </button>
                </div>}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[{
              key: 'active',
              label: `Active (${stats.active})`,
              icon: <CheckCircle size={16} />
            }, {
              key: 'pending',
              label: `Pending (${stats.pending})`,
              icon: <Clock size={16} />
            }, {
              key: 'declined',
              label: `Declined (${stats.declined})`,
              icon: <XCircle size={16} />
            }].map(tab => <button key={tab.key} onClick={() => setActiveTab(tab.key as 'active' | 'pending' | 'declined')} className={`px-6 py-3 text-base font-medium transition-all duration-200 border-2 flex items-center space-x-2 ${activeTab === tab.key ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>)}
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Loading connections...</h3>
              <p className="text-gray-600 text-lg">Please wait while we fetch your connections.</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mb-6">
                <AlertCircle size={64} className="mx-auto text-red-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-600">Error Loading Connections</h3>
              <p className="text-gray-600 text-lg mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-6 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Connections List */}
          {!loading && !error && (
            <AnimatePresence mode="wait">
              {filteredConnections.length > 0 ? <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="space-y-4">
                {filteredConnections.map((connection, index) => <motion.div key={connection.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: index * 0.05
            }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Selection Checkbox */}
                        {activeTab === 'active' && <input type="checkbox" checked={selectedConnections.includes(connection.id)} onChange={() => toggleConnectionSelection(connection.id)} className="mt-2 w-4 h-4 text-black border-2 border-gray-300 focus:ring-black focus:ring-2" />}

                        {/* Profile Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 flex-shrink-0">
                          <User size={24} className="text-gray-400" />
                        </div>

                        {/* Connection Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{connection.connected_user?.name || 'Unknown User'}</h3>
                              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                <Building size={16} />
                                <span>{connection.connected_user?.role || 'Unknown Role'} at {connection.connected_user?.company || 'Unknown Company'}</span>
                              </div>
                            </div>

                            {/* Priority Badge for Pending */}
                            {activeTab === 'pending' && connection.waiting_days && <div className={`px-3 py-1 text-sm font-medium border ${getPriorityLevel(connection.waiting_days) === 'high' ? 'bg-red-100 text-red-800 border-red-200' : getPriorityLevel(connection.waiting_days) === 'medium' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                {connection.waiting_days} days waiting
                              </div>}
                          </div>

                          {/* Opportunity Connection */}
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">Connected through:</p>
                            <p className="font-medium">{connection.opportunity?.title || 'Unknown Opportunity'}</p>
                          </div>

                          {/* Connection Date */}
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                            <Calendar size={14} />
                            <span>
                              {activeTab === 'active' ? 'Contact shared' : activeTab === 'pending' ? 'Request received' : 'Declined'} on {formatDate(connection.created_at)}
                            </span>
                          </div>

                          {/* Request Type for Pending */}
                          {activeTab === 'pending' && connection.request_type && <div className="mb-4">
                              <div className="flex items-center space-x-2">
                                {connection.request_type === 'questionnaire' ? <FileText size={16} className="text-blue-600" /> : <Send size={16} className="text-green-600" />}
                                <span className="text-sm font-medium">
                                  {connection.request_type === 'questionnaire' ? 'Questionnaire response awaiting review' : 'Direct contact request'}
                                </span>
                              </div>
                            </div>}

                          {/* Decline Reason for Declined */}
                          {activeTab === 'declined' && connection.decline_reason && <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-1">Reason:</p>
                              <p className="text-sm italic text-gray-700">{connection.decline_reason}</p>
                            </div>}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
                        <button onClick={() => handleViewProfile(connection.id)} className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium">
                          <Eye size={16} />
                          <span>View Profile</span>
                        </button>

                        {activeTab === 'active' && <button 
                          onClick={() => setShowRevokeModal(connection.id)} 
                          disabled={actionLoading === connection.id}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === connection.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <UserX size={16} />
                          )}
                          <span>{actionLoading === connection.id ? 'Processing...' : 'Revoke Access'}</span>
                        </button>}

                        {activeTab === 'pending' && <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button 
                              onClick={() => handleShareContact(connection.id)} 
                              disabled={actionLoading === connection.id}
                              className="bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === connection.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <Check size={16} />
                              )}
                              <span>{actionLoading === connection.id ? 'Processing...' : 'Share Contact'}</span>
                            </button>
                            {connection.request_type === 'direct' && <button 
                              onClick={() => handleSendQuestionnaire(connection.id)} 
                              disabled={actionLoading === connection.id}
                              className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === connection.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <FileText size={16} />
                              )}
                              <span>{actionLoading === connection.id ? 'Processing...' : 'Send Questionnaire'}</span>
                            </button>}
                            <button 
                              onClick={() => setShowDeclineModal(connection.id)} 
                              disabled={actionLoading === connection.id}
                              className="bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === connection.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <X size={16} />
                              )}
                              <span>{actionLoading === connection.id ? 'Processing...' : 'Decline'}</span>
                            </button>
                          </div>}

                                                {activeTab === 'declined' && <button 
                          onClick={() => handleReconsider(connection.id)} 
                          disabled={actionLoading === connection.id}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === connection.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <RotateCcw size={16} />
                          )}
                          <span>{actionLoading === connection.id ? 'Processing...' : 'Reconsider'}</span>
                        </button>}
                      </div>
                    </div>
                  </motion.div>)}
              </motion.div> :
          // Empty State
          <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="text-center py-16">
                <div className="mb-6">
                  {activeTab === 'active' && <Users size={64} className="mx-auto text-gray-300" />}
                  {activeTab === 'pending' && <Clock size={64} className="mx-auto text-gray-300" />}
                  {activeTab === 'declined' && <XCircle size={64} className="mx-auto text-gray-300" />}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  No {activeTab} connections
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  {activeTab === 'active' && "You haven't shared your contact details with anyone yet."}
                  {activeTab === 'pending' && "No pending connection requests at the moment."}
                  {activeTab === 'declined' && "No declined connection requests in your history."}
                </p>
              </motion.div>}
            </AnimatePresence>
          )}

        {/* Revoke Access Modal */}
        <AnimatePresence>
          {showRevokeModal && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{
              scale: 0.9,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} exit={{
              scale: 0.9,
              opacity: 0
            }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Revoke Contact Access?</h3>
              <p className="text-gray-600 mb-6">
                This person will no longer have access to your contact details. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-4">
                <button onClick={() => setShowRevokeModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                  Cancel
                </button>
                <button onClick={() => handleRevokeAccess(showRevokeModal)} className="bg-red-600 text-white px-6 py-3 text-base font-semibold hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20">
                  Revoke Access
                </button>
              </div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>

        {/* Decline Request Modal */}
        <AnimatePresence>
          {showDeclineModal && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{
              scale: 0.9,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} exit={{
              scale: 0.9,
              opacity: 0
            }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Decline Connection Request?</h3>
              <p className="text-gray-600 mb-6">
                This will decline the connection request. You can reconsider this decision later if needed.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (optional)
                </label>
                <textarea className="w-full p-3 border-2 border-gray-200 focus:border-black focus:outline-none transition-colors resize-none" rows={3} placeholder="Brief reason for declining..." />
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button onClick={() => setShowDeclineModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                  Cancel
                </button>
                <button onClick={() => handleDeclineRequest(showDeclineModal)} className="bg-red-600 text-white px-6 py-3 text-base font-semibold hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20">
                  Decline Request
                </button>
              </div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  };
export default MyConnectionsPage;