"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Clock, Bookmark, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
interface Opportunity {
  id: string;
  title: string;
  type: 'Jobs' | 'Investment' | 'Co-founder' | 'Mentorship' | 'Events' | 'Partnerships';
  company: string;
  location: string;
  description: string;
  postedAt: string;
  isBookmarked?: boolean;
}
const OpportunitiesDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load opportunities from database
  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select(`
            id,
            title,
            type,
            company,
            location,
            description,
            created_at
          `)
          .eq('is_active', true)
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
          location: opp.location,
          description: opp.description,
          postedAt: formatTimeAgo(opp.created_at),
          isBookmarked: false // TODO: Implement bookmark functionality
        })) || [];

        setOpportunities(formattedOpportunities);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, []);

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
  const handleBookmark = (id: string) => {
    // Handle bookmark functionality
    console.log('Bookmark toggled for opportunity:', id);
  };
  const handleGrabIt = async (opportunity: Opportunity) => {
    if (!user) {
      console.error('No authenticated user');
      return;
    }

    try {
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
        // You could show an error message to the user here
        return;
      }

      console.log('Opportunity grabbed successfully:', data);
      
      // Navigate to status page showing opportunity grabbed
      navigate(`/status/opportunity-grabbed?title=${encodeURIComponent(opportunity.title)}&company=${encodeURIComponent(opportunity.company)}`);
    } catch (error) {
      console.error('Failed to grab opportunity:', error);
      // You could show an error message to the user here
    }
  };
  return (
    <>
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
                      <button onClick={() => handleBookmark(opportunity.id)} className="text-gray-400 hover:text-black transition-colors duration-200">
                        <Bookmark size={20} className={opportunity.isBookmarked ? 'fill-current text-black' : ''} />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors duration-200">
                      {opportunity.title}
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
                      <button onClick={() => handleGrabIt(opportunity)} className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20">
                        Grab It
                      </button>
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
      }} className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 z-50" whileHover={{
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