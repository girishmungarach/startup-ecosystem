"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Edit, MoreHorizontal, Users, TrendingUp, CheckCircle, Clock, AlertCircle, X, BarChart3 } from 'lucide-react';
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
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    // TODO: Implement edit functionality
    console.log('Edit opportunity:', opportunityId);
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
        }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
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
            }].map(tab => <button key={tab.key} onClick={() => setActiveTab(tab.key as 'active' | 'draft' | 'closed')} className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all duration-200 border-2 whitespace-nowrap ${activeTab === tab.key ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                  {tab.label}
                </button>)}
            </div>

            {/* Post New Opportunity Button */}
            <button 
              onClick={() => navigate('/opportunities/post')}
              className="bg-black text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center justify-center space-x-2 w-full sm:w-auto"
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
          }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opportunity, index) => <motion.div key={opportunity.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: index * 0.1
            }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 hover:shadow-lg group relative">
                    {/* Notification Badge */}
                    {opportunity.hasNotifications && <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></div>}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(opportunity.type)}`}>
                        {opportunity.type}
                      </span>
                      <div className="flex items-center space-x-2">
                        {opportunity.status === 'active' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        {opportunity.status === 'draft' && <Clock size={16} className="text-orange-500" />}
                        {opportunity.status === 'closed' && <X size={16} className="text-gray-500" />}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors duration-200">
                      {opportunity.title}
                    </h3>

                    {/* Company and Date */}
                    <div className="space-y-2 mb-4">
                      <p className="text-base font-semibold text-gray-800">
                        {opportunity.company}
                      </p>
                      <p className="text-sm text-gray-600">
                        Posted {opportunity.postedAt}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                      {opportunity.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{opportunity.viewCount} views</span>
                        <span className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{opportunity.grabCount} grabs</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="mb-4">
                      {opportunity.grabCount > 0 ? <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">
                            {opportunity.grabCount} people grabbed this
                          </span>
                        </div> : <div className="flex items-center space-x-2 text-gray-500">
                          <AlertCircle size={16} />
                          <span className="text-sm">No grabs yet</span>
                        </div>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        {opportunity.grabCount > 0 && <button onClick={() => handleViewGrabs(opportunity.id)} className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-1">
                            <Eye size={16} />
                            <span className="text-sm font-medium">View Grabs</span>
                          </button>}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(opportunity.id)} className="text-gray-600 hover:text-black transition-colors duration-200" title="Edit">
                          <Edit size={16} />
                        </button>
                        
                        {opportunity.status === 'active' ? <button onClick={() => setShowCloseModal(opportunity.id)} className="text-red-600 hover:text-red-800 transition-colors duration-200" title="Close">
                            <X size={16} />
                          </button> : opportunity.status === 'closed' ? <button onClick={() => handleReopenOpportunity(opportunity.id)} className="text-green-600 hover:text-green-800 transition-colors duration-200 text-sm font-medium">
                            Reopen
                          </button> : null}
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
        </>
      );
    };
export default MyOpportunitiesDashboard;