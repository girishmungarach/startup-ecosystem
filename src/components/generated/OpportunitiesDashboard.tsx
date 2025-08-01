"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Clock, Bookmark, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { bookmarksService } from '../../services/bookmarks';
interface Opportunity {
  id: string;
  title: string;
  type: 'Jobs' | 'Investment' | 'Co-founder' | 'Mentorship' | 'Events' | 'Partnerships';
  company: string;
  location: string;
  description: string;
  postedAt: string;
  isBookmarked?: boolean;
  isGrabbed?: boolean;
  user_id: string; // <-- Added for Vercel build fix
}
const OpportunitiesDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [grabbingOpportunityId, setGrabbingOpportunityId] = useState<string | null>(null);
  const [bookmarkingOpportunityId, setBookmarkingOpportunityId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Set page title
  useEffect(() => {
    document.title = 'Latest Opportunities - Startup Ecosystem';
  }, []);

  // Load opportunities from database
  useEffect(() => {
    const loadOpportunities = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load opportunities
        const { data: opportunitiesData, error: opportunitiesError } = await supabase
          .from('opportunities')
          .select('id, title, type, company, location, description, created_at, user_id, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

              if (opportunitiesError) {
        console.error('Error loading opportunities:', opportunitiesError);
        setError('Failed to load opportunities. Please try again.');
        return;
      }

        // Load user's grabs to check which opportunities they've already grabbed
        const { data: grabsData, error: grabsError } = await supabase
          .from('opportunity_grabs')
          .select('opportunity_id')
          .eq('user_id', user.id);

        if (grabsError) {
          console.error('Error loading user grabs:', grabsError);
        }

        const userGrabbedIds = new Set(grabsData?.map(grab => grab.opportunity_id) || []);

        // Load user's bookmarks to check which opportunities they've bookmarked
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select('opportunity_id')
          .eq('user_id', user.id)
          .eq('bookmark_type', 'opportunity');

        if (bookmarksError) {
          console.error('Error loading user bookmarks:', bookmarksError);
        }

        const userBookmarkedIds = new Set(bookmarksData?.map(bookmark => bookmark.opportunity_id) || []);

        // Filter out opportunities posted by the current user
        const filteredOpportunitiesData = opportunitiesData?.filter(opp => opp.user_id && opp.user_id !== user.id) || [];

        const formattedOpportunities: Opportunity[] = filteredOpportunitiesData.map(opp => ({
          id: opp.id,
          title: opp.title,
          type: opp.type,
          company: opp.company,
          location: opp.location,
          description: opp.description,
          created_at: opp.created_at,
          user_id: opp.user_id, // <-- include user_id
          postedAt: formatTimeAgo(opp.created_at),
          isBookmarked: userBookmarkedIds.has(opp.id),
          isGrabbed: userGrabbedIds.has(opp.id)
        }));

        setOpportunities(formattedOpportunities);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
        setError('Failed to load opportunities. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
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
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };
  const filterOptions = ['All', 'Jobs', 'Investment', 'Co-founder', 'Mentorship', 'Events', 'Partnerships'];
  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;
    if (activeFilter !== 'All') {
      filtered = filtered.filter(opp => opp.type === activeFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opp => opp.title.toLowerCase().includes(query) || opp.company.toLowerCase().includes(query) || opp.description.toLowerCase().includes(query) || opp.location.toLowerCase().includes(query));
    }
    return filtered;
  }, [opportunities, activeFilter, searchQuery]);
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
  const handleBookmark = async (opportunity: Opportunity) => {
    if (!user) return;

    setBookmarkingOpportunityId(opportunity.id);
    try {
      // Get the opportunity owner's user ID for bookmarking
      const { data: opportunityData, error: opportunityError } = await supabase
        .from('opportunities')
        .select('user_id')
        .eq('id', opportunity.id)
        .single();

      if (opportunityError) {
        console.error('Error getting opportunity owner:', opportunityError);
        return;
      }

      // Toggle bookmark
      const isBookmarked = await bookmarksService.toggleBookmark(
        user.id,
        opportunityData.user_id,
        'opportunity',
        opportunity.id
      );

      // Update local state
      setOpportunities(prev => prev.map(opp => 
        opp.id === opportunity.id ? { ...opp, isBookmarked } : opp
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setBookmarkingOpportunityId(null);
    }
  };
  const handleGrabIt = async (opportunity: Opportunity) => {
    if (!user) {
      console.error('No authenticated user');
      return;
    }

    setGrabbingOpportunityId(opportunity.id);

    try {
      // First check if user has already grabbed this opportunity
      const { data: existingGrab, error: checkError } = await supabase
        .from('opportunity_grabs')
        .select('id')
        .eq('opportunity_id', opportunity.id)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing grab:', checkError);
        return;
      }

      if (existingGrab) {
        // User has already grabbed this opportunity
        alert('You have already shown interest in this opportunity!');
        return;
      }

      // Save the opportunity grab to database
      const { data, error } = await supabase
        .from('opportunity_grabs')
        .insert({
          opportunity_id: opportunity.id,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error grabbing opportunity:', error);
        alert('Failed to show interest. Please try again.');
        return;
      }

      console.log('Opportunity grabbed successfully:', data);
      
      // Update local state to show the opportunity as grabbed
      setOpportunities(prev => prev.map(opp => 
        opp.id === opportunity.id ? { ...opp, isGrabbed: true } : opp
      ));
      
      // Navigate to status page showing opportunity grabbed
      navigate(`/status/opportunity-grabbed?title=${encodeURIComponent(opportunity.title)}&company=${encodeURIComponent(opportunity.company)}`);
    } catch (error) {
      console.error('Failed to grab opportunity:', error);
      alert('Failed to show interest. Please try again.');
    } finally {
      setGrabbingOpportunityId(null);
    }
  };
  return (
    <>
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Opportunities</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Discover jobs, investments, partnerships, and more from India's most innovative startups.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.1
      }} className="mb-6 md:mb-8 space-y-4 md:space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search opportunities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {filterOptions.map(filter => <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all duration-200 border-2 whitespace-nowrap ${activeFilter === filter ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'}`}>
              {filter}
            </button>)}
        </div>
      </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 p-6 rounded-lg mb-6"
            >
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertCircle size={20} />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-red-600 hover:text-red-800 text-sm mt-2 underline"
              >
                Try again
              </button>
            </motion.div>
          )}

          {/* Opportunities Grid */}
          <AnimatePresence mode="wait">
            {isLoading ?
          // Loading Skeleton
          <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => <div key={index} className="border-2 border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>)}
              </motion.div> : filteredOpportunities.length > 0 ? <motion.div initial={{
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
            }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 hover:shadow-lg group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(opportunity.type)}`}>
                        {opportunity.type}
                      </span>
                      <button 
                        onClick={() => handleBookmark(opportunity)} 
                        disabled={bookmarkingOpportunityId === opportunity.id}
                        className="text-gray-400 hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bookmarkingOpportunityId === opportunity.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                        ) : (
                          <Bookmark size={20} className={opportunity.isBookmarked ? 'fill-current text-black' : ''} />
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors duration-200">
                      <button 
                        onClick={() => window.location.href = `/opportunities/${opportunity.id}`}
                        className="text-left hover:text-gray-600 transition-colors duration-200"
                      >
                        {opportunity.title}
                      </button>
                    </h3>

                    {/* Company and Location */}
                    <div className="space-y-2 mb-4">
                      <p className="text-base font-semibold text-gray-800">
                        {opportunity.company}
                      </p>
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span className="text-sm">{opportunity.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                      {opportunity.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span className="text-xs">Posted {opportunity.postedAt}</span>
                      </div>
                      {opportunity.isGrabbed ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">Interest Sent</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleGrabIt(opportunity)} 
                          disabled={grabbingOpportunityId === opportunity.id}
                          className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {grabbingOpportunityId === opportunity.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Grabbing...</span>
                            </>
                          ) : (
                            'Grab It'
                          )}
                        </button>
                      )}
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
                <Filter size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold mb-4">No opportunities found</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Try adjusting your search or filters to find more opportunities.
                </p>
              </motion.div>}
          </AnimatePresence>

      {/* Floating Action Button */}
      <Link to="/opportunities/post">
        <motion.button initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        duration: 0.3,
        delay: 0.5
      }} className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-black text-white p-4 sm:p-4 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 z-50 min-w-[56px] min-h-[56px] flex items-center justify-center" whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.9
      }}>
          <Plus size={24} />
          <span className="sr-only">Post New Opportunity</span>
        </motion.button>
      </Link>
    </>
  );
};
export default OpportunitiesDashboard;