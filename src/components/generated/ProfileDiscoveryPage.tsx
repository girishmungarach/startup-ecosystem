"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Bookmark, User, MapPin, Building, Briefcase, X, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profilesService, Profile, ProfileFilters } from '../../services/profiles';
import { bookmarksService } from '../../services/bookmarks';
import { Link } from 'react-router-dom';

const ProfileDiscoveryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedBuildingStatus, setSelectedBuildingStatus] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [availableInterests, setAvailableInterests] = useState<string[]>([]);
  const buildingStatusOptions = ['All', 'Actively building', 'Exploring ideas', 'Looking for opportunities'];
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load profiles and available options
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const [profilesData, rolesData, interestsData] = await Promise.all([
          profilesService.getProfilesWithBookmarks(user.id),
          profilesService.getAvailableRoles(),
          profilesService.getAvailableInterests()
        ]);
        
        setProfiles(profilesData);
        setAvailableRoles(rolesData);
        setAvailableInterests(interestsData);
      } catch (err) {
        setError('Failed to load profiles');
        console.error('Error loading profiles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Apply filters to profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = searchQuery === '' || 
        (profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
        (profile.company?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
        (profile.current_project?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesRole = selectedRoles.length === 0 || 
        selectedRoles.includes('All') || 
        selectedRoles.some(role => {
          if (role === 'Founders') return profile.role === 'Founder';
          if (role === 'Investors') return profile.role === 'Investor';
          if (role === 'Developers') return profile.role === 'Developer';
          if (role === 'Designers') return profile.role === 'Designer';
          if (role === 'Students') return profile.role === 'Student';
          return profile.role === role;
        });
      
      const matchesInterests = selectedInterests.length === 0 || 
        selectedInterests.some(interest => profile.interests?.includes(interest) || false);
      
      const matchesBuildingStatus = selectedBuildingStatus.length === 0 || 
        selectedBuildingStatus.includes('All') || 
        (profile.building_status && selectedBuildingStatus.includes(profile.building_status));
      
      return matchesSearch && matchesRole && matchesInterests && matchesBuildingStatus;
    });
  }, [profiles, searchQuery, selectedRoles, selectedInterests, selectedBuildingStatus]);
  const toggleFilter = (filterArray: string[], setFilterArray: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (value === 'All') {
      setFilterArray(filterArray.includes('All') ? [] : ['All']);
    } else {
      setFilterArray(prev => {
        const newArray = prev.includes(value) ? prev.filter(item => item !== value) : [...prev.filter(item => item !== 'All'), value];
        return newArray;
      });
    }
  };
  const toggleBookmark = async (profileId: string) => {
    if (!user) return;
    
    try {
      const wasAdded = await bookmarksService.toggleBookmark(profileId, user.id, 'profile');
      
      // Update local state
      setProfiles(prev => prev.map(profile => profile.id === profileId ? {
        ...profile,
        is_bookmarked: wasAdded
      } : profile));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      // You could add a toast notification here
    }
  };
  const clearAllFilters = () => {
    setSelectedRoles([]);
    setSelectedInterests([]);
    setSelectedBuildingStatus([]);
    setSearchQuery('');
  };
  const hasActiveFilters = selectedRoles.length > 0 || selectedInterests.length > 0 || selectedBuildingStatus.length > 0 || searchQuery !== '';
  const SkeletonCard = () => <div className="bg-white border-2 border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex space-x-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>;

  // Helper: check if user is authorized to view full contact info
  const canViewContact = (profile: Profile) => {
    // Example: Only allow if profile.allow_contact === true or user is the profile owner
    if (!user || !profile) return false;
    return profile.allow_contact || user.id === profile.id;
  };
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Profiles
            </h2>
            <p className="text-xl md:text-2xl font-light max-w-3xl">
              Connect with founders, investors, developers, and innovators building the future of technology.
            </p>
          </motion.div>
        </div>

      {/* Search and Filters */}
      <section className="px-6 py-8 md:px-12 lg:px-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search by name, company, or project..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 hover:border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10">
              <Filter size={20} />
              <span className="font-semibold">Filters</span>
            </button>
            
            {hasActiveFilters && <button onClick={clearAllFilters} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
                <X size={16} />
                <span>Clear all filters</span>
              </button>}
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }} className="space-y-6 pb-6">
                {/* Role Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Role</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...availableRoles].map(role => (
                      <button 
                        key={role} 
                        onClick={() => toggleFilter(selectedRoles, setSelectedRoles, role)} 
                        className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedRoles.includes(role) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableInterests.map(interest => (
                      <button 
                        key={interest} 
                        onClick={() => toggleFilter(selectedInterests, setSelectedInterests, interest)} 
                        className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedInterests.includes(interest) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Building Status Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Building Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {buildingStatusOptions.map(status => <button key={status} onClick={() => toggleFilter(selectedBuildingStatus, setSelectedBuildingStatus, status)} className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedBuildingStatus.includes(status) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>
                        {status}
                      </button>)}
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold">
              {filteredProfiles.length} {filteredProfiles.length === 1 ? 'Profile' : 'Profiles'} Found
            </h3>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mb-6">
                <AlertCircle size={64} className="mx-auto text-red-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-600">Error Loading Profiles</h3>
              <p className="text-gray-600 text-lg mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-6 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProfiles.length === 0 && (
            <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} className="text-center py-16">
              <User size={64} className="mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-semibold mb-4">No profiles found</h3>
              <p className="text-lg text-gray-600 mb-6">
                Try adjusting your search criteria or clearing some filters.
              </p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-all duration-200">
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}

          {/* Profile Grid */}
          {!isLoading && !error && filteredProfiles.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-lg hover:border-black transition-all duration-300 group flex flex-col justify-between min-h-[460px]"
                >
                  {/* Profile Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                        <User size={32} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 leading-tight">{profile.name}</h4>
                        <p className="text-gray-600 flex items-center space-x-1 mt-1">
                          <Briefcase size={14} />
                          <span>{profile.role}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(profile.id)}
                    className={`p-2 rounded-full transition-all duration-200 ${profile.is_bookmarked ? 'bg-black text-white hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                    title={profile.is_bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                  >
                    <Bookmark size={20} className={profile.is_bookmarked ? 'fill-current' : ''} />
                  </button>

                  {/* Company and Location */}
                  <div className="mb-4 space-y-1">
                    <p className="flex items-center space-x-1 text-gray-600">
                      <Building size={14} />
                      <span>{profile.company}</span>
                    </p>
                    {profile.location && (
                      <p className="flex items-center space-x-1 text-gray-600">
                        <MapPin size={14} />
                        <span>{profile.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Current Project */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Currently building:</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {profile.current_project}
                    </p>
                  </div>

                  {/* Interest Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map(interest => (
                        <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Building Status */}
                  <div className="mb-6">
                    <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${profile.building_status === 'Actively building' ? 'bg-green-50 text-green-700 border-green-200' : profile.building_status === 'Exploring ideas' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{profile.building_status}</span>
                  </div>

                  {/* View Profile Button */}
                  <button
                    className="w-full bg-black text-white py-4 sm:py-3 font-semibold hover:bg-gray-900 transition-all duration-200 group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 min-h-[48px] flex items-center justify-center rounded-xl text-lg mt-auto"
                    tabIndex={0}
                    aria-label={`View profile of ${profile.name}`}
                    onClick={() => window.location.href = `/profiles/${profile.id}`}
                  >
                    View Profile
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {!isLoading && !error && filteredProfiles.length > 0 && filteredProfiles.length >= 8 && (
            <div className="text-center mt-12">
              <button 
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1500);
                }} 
                className="bg-white text-black border-2 border-black px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 min-h-[56px] flex items-center justify-center mx-auto"
              >
                Load More Profiles
              </button>
            </div>
          )}
        </div>
      </section>
      </main>

      {/* Big Card Modal for Profile */}
      <AnimatePresence>
        {showProfileModal && selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowProfileModal(false)}
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
                onClick={() => setShowProfileModal(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                  <User size={40} className="text-gray-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProfile.name}</h2>
                  <p className="text-gray-600 flex items-center space-x-1">
                    <Briefcase size={16} />
                    <span>{selectedProfile.role}</span>
                  </p>
                  <p className="text-gray-600 flex items-center space-x-1 mt-1">
                    <Building size={16} />
                    <span>{selectedProfile.company}</span>
                  </p>
                  {selectedProfile.location && (
                    <p className="text-gray-600 flex items-center space-x-1 mt-1">
                      <MapPin size={16} />
                      <span>{selectedProfile.location}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Currently building:</p>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedProfile.current_project}</p>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedProfile.interests.map(interest => (
                  <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 rounded-full">{interest}</span>
                ))}
              </div>
              <div className="mb-6">
                <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${selectedProfile.building_status === 'Actively building' ? 'bg-green-50 text-green-700 border-green-200' : selectedProfile.building_status === 'Exploring ideas' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{selectedProfile.building_status}</span>
              </div>
              {/* Blurred Email/Contact Info */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center">Contact Email</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-base font-mono px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 ${canViewContact(selectedProfile) ? '' : 'blur-sm select-none pointer-events-none'}`}>{selectedProfile.email}</span>
                  {!canViewContact(selectedProfile) && (
                    <span className="inline-flex items-center text-gray-400"><Lock size={16} className="mr-1" /> Blurred</span>
                  )}
                </div>
                {!canViewContact(selectedProfile) && (
                  <button className="mt-3 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200" onClick={() => {/* trigger connect/request access flow */}}>
                    Request Access
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProfileDiscoveryPage;