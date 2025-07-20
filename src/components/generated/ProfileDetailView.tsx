"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, User, MapPin, Building, Briefcase, Calendar, Clock, Eye, Mail, Linkedin, Globe, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company: string;
  location?: string;
  bio?: string;
  building?: string;
  interests?: string[];
  opportunities?: string[];
  linkedin_url?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
  isBookmarked?: boolean;
  isConnected?: boolean;
  connectionStatus?: 'pending' | 'accepted' | 'none';
}

interface Opportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  created_at: string;
}

interface ProfileDetailViewProps {
  profile?: Profile;
  onBack?: () => void;
  onBookmark?: (profileId: string) => void;
}

const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({
  profile: propProfile,
  onBack,
  onBookmark
}) => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(propProfile || null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'accepted' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) return;

      setIsLoading(true);
      try {
        // Load profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (profileError) {
          console.error('Error loading profile:', profileError);
          return;
        }

        if (profileData) {
          setProfile(profileData);
        }

        // Load user's opportunities
        const { data: opportunitiesData, error: opportunitiesError } = await supabase
          .from('opportunities')
          .select('id, title, type, description, created_at')
          .eq('user_id', profileId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!opportunitiesError && opportunitiesData) {
          setOpportunities(opportunitiesData);
        }

        // Check if current user has bookmarked this profile
        if (user) {
          const { data: bookmarkData } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', user.id)
            .eq('profile_id', profileId)
            .single();

          setIsBookmarked(!!bookmarkData);

          // Check connection status
          const { data: connectionData } = await supabase
            .from('connections')
            .select('*')
            .or(`requester_id.eq.${user.id},responder_id.eq.${user.id}`)
            .or(`requester_id.eq.${profileId},responder_id.eq.${profileId}`)
            .single();

          if (connectionData) {
            setIsConnected(true);
            setConnectionStatus(connectionData.status);
          }
        }
      } catch (error) {
        console.error('Error loading profile details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profileId, user]);

  const handleBookmarkToggle = async () => {
    if (!user || !profile) return;

    setIsLoadingActions(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('profile_id', profile.id);
        
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            profile_id: profile.id,
            tags: []
          });
        
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoadingActions(false);
    }
  };

  const handleConnect = async () => {
    if (!user || !profile) return;

    setIsLoadingActions(true);
    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: user.id,
          responder_id: profile.id,
          status: 'pending'
        });

      if (!error) {
        setIsConnected(true);
        setConnectionStatus('pending');
      }
    } catch (error) {
      console.error('Error creating connection:', error);
    } finally {
      setIsLoadingActions(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
          <button
            onClick={handleBackClick}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <motion.button 
              onClick={handleBackClick} 
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 px-4 py-2 -ml-4"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Browse</span>
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={handleBookmarkToggle}
                disabled={isLoadingActions}
                className="p-3 sm:p-3 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark size={20} className={`${isBookmarked ? 'fill-black text-black' : 'text-gray-400'} sm:w-6 sm:h-6`} />
              </motion.button>
              
              <motion.button 
                className="p-3 sm:p-3 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} className="text-gray-400 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={32} className="text-gray-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                    <p className="text-xl text-gray-600">{profile.role}</p>
                    {profile.company && (
                      <p className="text-gray-500 flex items-center">
                        <Building size={16} className="mr-1" />
                        {profile.company}
                      </p>
                    )}
                  </div>
                </div>

                {profile.location && (
                  <p className="text-gray-600 flex items-center mb-2">
                    <MapPin size={16} className="mr-2" />
                    {profile.location}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Joined {formatDate(profile.created_at)}
                  </span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Updated {formatDate(profile.updated_at)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                {user && user.id !== profile.id && (
                  <>
                    {!isConnected ? (
                      <motion.button
                        onClick={handleConnect}
                        disabled={isLoadingActions}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoadingActions ? 'Connecting...' : 'Connect'}
                      </motion.button>
                    ) : (
                      <div className="text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          connectionStatus === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {connectionStatus === 'accepted' ? 'Connected' : 'Pending'}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {profile.linkedin_url && (
                  <motion.a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 text-gray-600 hover:text-black transition-colors p-2 border border-gray-300 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                  </motion.a>
                )}

                {profile.website_url && (
                  <motion.a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 text-gray-600 hover:text-black transition-colors p-2 border border-gray-300 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Globe size={16} />
                    <span>Website</span>
                  </motion.a>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </motion.div>
            )}

            {/* What they're building */}
            {profile.building && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Briefcase className="mr-2 text-blue-600" size={20} />
                  What they're building
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.building}</p>
              </motion.div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold mb-3">Areas of Interest</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <motion.span
                      key={interest}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Looking for */}
            {profile.opportunities && profile.opportunities.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold mb-3">Looking for</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.opportunities.map((opportunity, index) => (
                    <motion.span
                      key={opportunity}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {opportunity}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Opportunities */}
            {opportunities.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold mb-4">Recent Opportunities</h3>
                <div className="space-y-4">
                  {opportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{opportunity.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{opportunity.type}</p>
                          <p className="text-gray-700 text-sm line-clamp-2">{opportunity.description}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-4">
                          {formatDate(opportunity.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDetailView;