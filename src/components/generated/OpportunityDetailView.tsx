"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, CheckCircle, AlertCircle, Users, Bookmark, Eye } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { bookmarksService } from '../../services/bookmarks';

interface OpportunityDetail {
  id: string;
  title: string;
  type: 'Jobs' | 'Investment' | 'Co-founder' | 'Mentorship' | 'Events' | 'Partnerships';
  company: string;
  location: string;
  description: string;
  requirements?: string;
  compensation?: string;
  contact_preference: 'direct' | 'review';
  screening_questions?: string;
  created_at: string;
  isGrabbed?: boolean;
  grabCount?: number;
  viewCount?: number;
  user_id: string; // <-- Added for Vercel build fix
}

const OpportunityDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadOpportunity = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // Load opportunity details
        const { data: opportunityData, error: opportunityError } = await supabase
          .from('opportunities')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (opportunityError) {
          console.error('Error loading opportunity:', opportunityError);
          setError('Opportunity not found or no longer available.');
          return;
        }

        // Check if user has already grabbed this opportunity
        let isGrabbed = false;
        let isBookmarked = false;
        if (user) {
          const [grabResult, bookmarkResult] = await Promise.all([
            supabase
              .from('opportunity_grabs')
              .select('id')
              .eq('opportunity_id', id)
              .eq('user_id', user.id)
              .single(),
            bookmarksService.isBookmarked(user.id, opportunityData.user_id, 'opportunity', id)
          ]);

          if (!grabResult.error || grabResult.error.code === 'PGRST116') {
            isGrabbed = !!grabResult.data;
          }
          isBookmarked = bookmarkResult;
        }

        // Get grab and view counts
        const { count: grabCount } = await supabase
          .from('opportunity_grabs')
          .select('*', { count: 'exact', head: true })
          .eq('opportunity_id', id);

        setOpportunity({
          ...opportunityData,
          isGrabbed,
          grabCount: grabCount || 0,
          viewCount: opportunityData.views_count || 0
        });
        setIsBookmarked(isBookmarked);
      } catch (error) {
        console.error('Failed to load opportunity:', error);
        setError('Failed to load opportunity details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunity();
  }, [id, user]);

  const handleGrabIt = async () => {
    if (!user || !opportunity) return;

    setIsGrabbing(true);
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
      
      // Update local state
      setOpportunity(prev => prev ? { ...prev, isGrabbed: true, grabCount: (prev.grabCount || 0) + 1 } : null);
      
      // Navigate to status page
      navigate(`/status/opportunity-grabbed?title=${encodeURIComponent(opportunity.title)}&company=${encodeURIComponent(opportunity.company)}`);
    } catch (error) {
      console.error('Failed to grab opportunity:', error);
      alert('Failed to show interest. Please try again.');
    } finally {
      setIsGrabbing(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || !opportunity) return;

    setIsBookmarking(true);
    try {
      // Toggle bookmark
      const newBookmarkStatus = await bookmarksService.toggleBookmark(
        user.id,
        opportunity.user_id || opportunity.id, // Use opportunity owner's user ID
        'opportunity',
        opportunity.id
      );

      setIsBookmarked(newBookmarkStatus);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="text-lg font-medium">Back</span>
            </button>
          </div>
          
          <div className="text-center py-16">
            <AlertCircle size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Opportunity Not Found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
              {error || 'This opportunity may have been removed or is no longer available.'}
            </p>
            <button 
              onClick={() => navigate('/opportunities')}
              className="bg-black text-white px-6 py-3 text-base font-semibold hover:bg-gray-900 transition-all duration-200"
            >
              Browse Other Opportunities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="text-lg font-medium">Back</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="border-2 border-gray-200 p-8 rounded-lg">
            <div className="flex items-start justify-between mb-6">
              <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(opportunity.type)}`}>
                {opportunity.type}
              </span>
              <button 
                onClick={handleBookmark}
                disabled={isBookmarking}
                className="text-gray-400 hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBookmarking ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                ) : (
                  <Bookmark size={20} className={isBookmarked ? 'fill-current text-black' : ''} />
                )}
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{opportunity.title}</h1>
            
            <div className="space-y-2 mb-6">
              <p className="text-xl font-semibold text-gray-800">{opportunity.company}</p>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>{opportunity.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Posted {formatTimeAgo(opportunity.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{opportunity.viewCount} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={14} />
                <span>{opportunity.grabCount} people interested</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {opportunity.requirements && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{opportunity.requirements}</p>
              </div>
            </div>
          )}

          {/* Compensation */}
          {opportunity.compensation && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Compensation</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{opportunity.compensation}</p>
              </div>
            </div>
          )}

          {/* Screening Questions */}
          {opportunity.screening_questions && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Screening Questions</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{opportunity.screening_questions}</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="border-t border-gray-200 pt-8">
            {opportunity.isGrabbed ? (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                  <CheckCircle size={24} />
                  <span className="text-lg font-medium">Interest Already Sent</span>
                </div>
                <p className="text-gray-600 mb-6">
                  You've already shown interest in this opportunity. The poster will review your application.
                </p>
                <button 
                  onClick={() => navigate('/opportunities')}
                  className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200"
                >
                  Browse More Opportunities
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button 
                  onClick={handleGrabIt}
                  disabled={isGrabbing}
                  className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {isGrabbing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Showing Interest...</span>
                    </>
                  ) : (
                    'Show Interest'
                  )}
                </button>
                <p className="text-gray-600 mt-4">
                  {opportunity.contact_preference === 'direct' 
                    ? 'Your contact information will be shared immediately with the poster.'
                    : 'The poster will review your interest and decide whether to share their contact information.'
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OpportunityDetailView; 