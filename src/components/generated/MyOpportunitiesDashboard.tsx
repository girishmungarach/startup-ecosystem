"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Edit, MoreHorizontal, Users, TrendingUp, CheckCircle, Clock, AlertCircle, X, BarChart3, Trash2, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
interface Opportunity {
  id: string;
  title: string;
  type: 'Jobs' | 'Investment' | 'Co-founder' | 'Mentorship' | 'Events' | 'Partnerships';
  company: string;
  postedAt: string;
  status: 'active' | 'draft' | 'closed';
  grabCount: number;
  viewCount: number;
  description: string;
  hasNotifications?: boolean;
}
interface StatsCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
}
const MyOpportunitiesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'closed'>('active');
  const [showCloseModal, setShowCloseModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);

  // Load user's opportunities from database
  useEffect(() => {
    const loadMyOpportunities = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select(`
            id,
            title,
            type,
            company,
            description,
            created_at,
            is_active,
            grabs_count,
            views_count
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading opportunities:', error);
          return;
        }

        const formattedOpportunities: Opportunity[] = data?.map(opp => ({
          id: opp.id,
          title: opp.title,
          type: opp.type,
          company: opp.company,
          postedAt: formatTimeAgo(opp.created_at),
          status: opp.is_active ? 'active' : 'closed',
          grabCount: opp.grabs_count || 0,
          viewCount: opp.views_count || 0,
          description: opp.description,
          hasNotifications: (opp.grabs_count || 0) > 0
        })) || [];

        setOpportunities(formattedOpportunities);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMyOpportunities();
  }, [user]);

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };

  // Statistics calculation
  const stats: StatsCard[] = useMemo(() => {
    const totalPosts = opportunities.length;
    const totalGrabs = opportunities.reduce((sum, opp) => sum + opp.grabCount, 0);
    const successfulConnections = opportunities.filter(opp => opp.grabCount > 0).length;
    return [{
      title: 'Total Posts',
      value: totalPosts.toString(),
      icon: <BarChart3 size={24} />,
      change: '+2 this month'
    }, {
      title: 'Total Grabs',
      value: totalGrabs.toString(),
      icon: <Users size={24} />,
      change: '+12 this week'
    }, {
      title: 'Successful Connections',
      value: successfulConnections.toString(),
      icon: <CheckCircle size={24} />,
      change: '78% success rate'
    }];
  }, [opportunities]);

  // Filter opportunities by tab
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => opp.status === activeTab);
  }, [activeTab, opportunities]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      active: opportunities.filter(opp => opp.status === 'active').length,
      draft: opportunities.filter(opp => opp.status === 'draft').length,
      closed: opportunities.filter(opp => opp.status === 'closed').length
    };
  }, [opportunities]);
  const getTypeColor = (type: string) => {
    const colors = {
      'Jobs': 'bg-blue-100 text-blue-800 border-blue-200',
      'Investment': 'bg-green-100 text-green-800 border-green-200',
      'Co-founder': 'bg-purple-100 text-purple-800 border-purple-200',
      'Mentorship': 'bg-orange-100 text-orange-800 border-orange-200',
      'Events': 'bg-pink-100 text-pink-800 border-pink-200',
      'Partnerships': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  const handleViewGrabs = (opportunityId: string) => {
    navigate(`/opportunities/${opportunityId}/review`);
  };
  const handleEdit = (opportunityId: string) => {
    navigate(`/post-opportunity?edit=true&id=${opportunityId}`);
  };
  const handleCloseOpportunity = async (opportunityId: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ is_active: false })
        .eq('id', opportunityId);

      if (error) {
        console.error('Error closing opportunity:', error);
        return;
      }

      // Refresh opportunities
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === opportunityId ? { ...opp, status: 'closed' as const } : opp
      );
      setOpportunities(updatedOpportunities);
      
      setShowCloseModal(null);
    } catch (error) {
      console.error('Failed to close opportunity:', error);
    }
  };
  const handleReopenOpportunity = async (opportunityId: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ is_active: true })
        .eq('id', opportunityId);

      if (error) {
        console.error('Error reopening opportunity:', error);
        return;
      }

      // Refresh opportunities
      const updatedOpportunities = opportunities.map(opp => 
        opp.id === opportunityId ? { ...opp, status: 'active' as const } : opp
      );
      setOpportunities(updatedOpportunities);
    } catch (error) {
      console.error('Failed to reopen opportunity:', error);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunityId)
        .eq('user_id', user.id); // Ensure user owns the opportunity

      if (error) {
        console.error('Error deleting opportunity:', error);
        return;
      }

      // Remove from local state
      const updatedOpportunities = opportunities.filter(opp => opp.id !== opportunityId);
      setOpportunities(updatedOpportunities);
      
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Failed to delete opportunity:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper: check if user is authorized to view full contact info
  const canViewContact = (opportunity: Opportunity) => {
    // Example: Only allow if opportunity.status === 'active' and user is the owner
    if (!user || !opportunity) return false;
    return user.id === opportunity.id; // Replace with your actual logic
  };
  return (
    <>
      {/* Statistics Cards */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.1
      }} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => <div key={stat.title} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600">
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.change && <div className="text-sm text-gray-500 mt-1">{stat.change}</div>}
              </div>
            </div>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
          </div>)}
      </motion.div>

          {/* Action Bar */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="flex flex-col space-y-4 mb-6 md:mb-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {[{
              key: 'active',
              label: `Active (${tabCounts.active})`
            }, {
              key: 'draft',
              label: `Draft (${tabCounts.draft})`
            }, {
              key: 'closed',
              label: `Closed (${tabCounts.closed})`
            }].map(tab => <button key={tab.key} onClick={() => setActiveTab(tab.key as 'active' | 'draft' | 'closed')} className={`px-4 md:px-6 py-3 md:py-3 text-sm md:text-base font-medium transition-all duration-200 border-2 whitespace-nowrap min-h-[44px] flex items-center justify-center ${activeTab === tab.key ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                  {tab.label}
                </button>)}
            </div>

            {/* Post New Opportunity Button */}
            <button 
              onClick={() => navigate('/opportunities/post')}
              className="w-full sm:w-auto bg-black text-white px-4 md:px-6 py-3 md:py-3 text-sm md:text-base font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <Plus size={18} className="md:w-5 md:h-5" />
              <span>Post New Opportunity</span>
            </button>
          </motion.div>

          {/* Opportunities Grid */}
          <AnimatePresence mode="wait">
            {filteredOpportunities.length > 0 ? <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOpportunities.map((opportunity, index) => <motion.div key={opportunity.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: index * 0.1
            }} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:border-black transition-all duration-300 group flex flex-col justify-between min-h-[420px]">
                    {/* Notification Badge */}
                    {opportunity.hasNotifications && <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></div>}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 text-sm font-medium border rounded-full ${getTypeColor(opportunity.type)}`}>{opportunity.type}</span>
                      <div className="flex items-center space-x-2">
                        {opportunity.status === 'active' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        {opportunity.status === 'draft' && <Clock size={16} className="text-orange-500" />}
                        {opportunity.status === 'closed' && <X size={16} className="text-gray-500" />}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-gray-700 transition-colors duration-200 cursor-pointer" onClick={() => { setSelectedOpportunity(opportunity); setShowOpportunityModal(true); }}>{opportunity.title}</h3>

                    {/* Company and Date */}
                    <div className="space-y-1 mb-3">
                      <p className="text-base font-semibold text-gray-800">{opportunity.company}</p>
                      <p className="text-sm text-gray-600">Posted {opportunity.postedAt}</p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">{opportunity.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{opportunity.viewCount} views</span>
                        <span className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{opportunity.grabCount} grabs</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="mb-3">
                      {opportunity.grabCount > 0 ? <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">{opportunity.grabCount} people grabbed this</span>
                        </div> : <div className="flex items-center space-x-2 text-gray-500">
                          <AlertCircle size={16} />
                          <span className="text-sm">No grabs yet</span>
                        </div>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 gap-3 mt-auto">
                      <div className="flex items-center space-x-2">
                        <button className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium" onClick={() => window.location.href = `/opportunities/${opportunity.id}`}> <Eye size={16} /> <span>View Opportunity</span> </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(opportunity.id)} className="text-gray-600 hover:text-black transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center" title="Edit">
                          <Edit size={16} />
                        </button>
                        {opportunity.status === 'active' ? (
                          <button onClick={() => setShowCloseModal(opportunity.id)} className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50 min-w-[40px] min-h-[40px] flex items-center justify-center" title="Close">
                            <X size={16} />
                          </button>
                        ) : opportunity.status === 'closed' ? (
                          <button onClick={() => handleReopenOpportunity(opportunity.id)} className="text-green-600 hover:text-green-800 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-50 min-h-[40px]">
                            Reopen
                          </button>
                        ) : null}
                        <button onClick={() => setShowDeleteModal(opportunity.id)} className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50 min-w-[40px] min-h-[40px] flex items-center justify-center" title="Delete">
                          <Trash2 size={16} />
                        </button>
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
                  {activeTab === 'active' && <TrendingUp size={64} className="mx-auto text-gray-300" />}
                  {activeTab === 'draft' && <Clock size={64} className="mx-auto text-gray-300" />}
                  {activeTab === 'closed' && <CheckCircle size={64} className="mx-auto text-gray-300" />}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  No {activeTab} opportunities
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                  {activeTab === 'active' && "You don't have any active opportunities. Post one to get started!"}
                  {activeTab === 'draft' && "No draft opportunities found. Create a new opportunity and save it as draft."}
                  {activeTab === 'closed' && "No closed opportunities yet. Your completed opportunities will appear here."}
                </p>
                {activeTab !== 'closed' && <button 
                  onClick={() => navigate('/opportunities/post')}
                  className="bg-black text-white px-6 py-3 text-base font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2 mx-auto"
                >
                    <Plus size={20} />
                    <span>Post New Opportunity</span>
                  </button>}
              </motion.div>}
          </AnimatePresence>

          {/* Big Card Modal for Opportunity */}
          <AnimatePresence>
            {showOpportunityModal && selectedOpportunity && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-black bg-opacity-50 flex items-center justify-center p-4"
                onClick={() => setShowOpportunityModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative flex flex-col"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                    onClick={() => setShowOpportunityModal(false)}
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                  <div className="mb-6">
                    <span className={`px-3 py-1 text-sm font-medium border rounded-full ${getTypeColor(selectedOpportunity.type)}`}>{selectedOpportunity.type}</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-2">{selectedOpportunity.title}</h2>
                    <p className="text-gray-600 font-semibold">{selectedOpportunity.company}</p>
                    <p className="text-gray-600 text-sm">Posted {selectedOpportunity.postedAt}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedOpportunity.description}</p>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-600">{selectedOpportunity.viewCount} views</span>
                    <span className="text-xs text-gray-600">{selectedOpportunity.grabCount} grabs</span>
                  </div>
                  {/* Blurred Email/Contact Info */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center">Contact Email</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-base font-mono px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 ${canViewContact(selectedOpportunity) ? '' : 'blur-sm select-none pointer-events-none'}`}>example@email.com</span>
                      {!canViewContact(selectedOpportunity) && (
                        <span className="inline-flex items-center text-gray-400"><Lock size={16} className="mr-1" /> Blurred</span>
                      )}
                    </div>
                    {!canViewContact(selectedOpportunity) && (
                      <button className="mt-3 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200" onClick={() => {/* trigger connect/request access flow */}}>
                        Request Access
                      </button>
                    )}
                  </div>
                  {/* Microfunctions: Bookmark, Grab, Edit, Delete, etc. */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200">Bookmark</button>
                    <button className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200">Grab Opportunity</button>
                    <button className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200">Edit</button>
                    <button className="px-4 py-2 bg-white text-black border border-black rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200">Delete</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close Confirmation Modal */}
          <AnimatePresence>
            {showCloseModal && <motion.div initial={{
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
                <h3 className="text-2xl font-bold mb-4">Close Opportunity?</h3>
                <p className="text-gray-600 mb-6">
                  This will close the opportunity and stop accepting new applications. You can reopen it later if needed.
                </p>
                <div className="flex items-center justify-end space-x-4">
                  <button onClick={() => setShowCloseModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                    Cancel
                  </button>
                  <button onClick={() => handleCloseOpportunity(showCloseModal)} className="bg-red-600 text-white px-6 py-3 text-base font-semibold hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20">
                    Close Opportunity
                  </button>
                </div>
              </motion.div>
            </motion.div>}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteModal && <motion.div initial={{
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
                <h3 className="text-2xl font-bold mb-4">Delete Opportunity?</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. The opportunity and all associated data will be permanently deleted.
                </p>
                <div className="flex items-center justify-end space-x-4">
                  <button onClick={() => setShowDeleteModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDeleteOpportunity(showDeleteModal)} 
                    disabled={isDeleting}
                    className="bg-red-600 text-white px-6 py-3 text-base font-semibold hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Opportunity'}
                  </button>
                </div>
              </motion.div>
            </motion.div>}
          </AnimatePresence>
        </>
      );
    };
export default MyOpportunitiesDashboard;