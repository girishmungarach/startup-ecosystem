"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, User, MapPin, Building, Briefcase, X, Trash2, Plus, Check, ChevronDown, Calendar, Tag, Users } from 'lucide-react';
interface BookmarkedProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  currentProject: string;
  location?: string;
  customTags: string[];
  addedDaysAgo: number;
  profileImage?: string;
  isSelected?: boolean;
}
const BookmarksManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'role'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [editingTags, setEditingTags] = useState<string | null>(null);

  // Mock bookmarked profiles data
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState<BookmarkedProfile[]>([{
    id: '1',
    name: 'Sarah Chen',
    role: 'Founder',
    company: 'HealthTech Innovations',
    currentProject: 'Building an AI-powered diagnostic platform for early disease detection',
    location: 'San Francisco',
    customTags: ['Potential co-founder', 'HealthTech'],
    addedDaysAgo: 3
  }, {
    id: '2',
    name: 'Rajesh Kumar',
    role: 'Developer',
    company: 'Fintech Solutions',
    currentProject: 'Developing a blockchain-based payment system for rural banking',
    location: 'Bangalore',
    customTags: ['Future hire', 'Blockchain Expert'],
    addedDaysAgo: 7
  }, {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Investor',
    company: 'Venture Capital Partners',
    currentProject: 'Looking for promising EdTech startups to invest in Series A rounds',
    location: 'New York',
    customTags: ['Interesting investor', 'Series A'],
    addedDaysAgo: 12
  }, {
    id: '4',
    name: 'David Park',
    role: 'Designer',
    company: 'Creative Studio',
    currentProject: 'Designing user experiences for sustainable agriculture mobile apps',
    location: 'Seoul',
    customTags: ['Collaborator', 'UX Expert'],
    addedDaysAgo: 5
  }, {
    id: '5',
    name: 'Priya Sharma',
    role: 'Marketing',
    company: 'Growth Hackers Inc',
    currentProject: 'Exploring growth strategies for B2B SaaS companies in emerging markets',
    location: 'Mumbai',
    customTags: ['Mentor', 'Growth Expert'],
    addedDaysAgo: 15
  }, {
    id: '6',
    name: 'Alex Thompson',
    role: 'Student',
    company: 'Stanford University',
    currentProject: 'Researching machine learning applications in gaming and entertainment',
    location: 'Palo Alto',
    customTags: ['Future hire', 'AI Research'],
    addedDaysAgo: 2
  }, {
    id: '7',
    name: 'Maria Santos',
    role: 'Sales',
    company: 'TechSales Pro',
    currentProject: 'Building a sales automation platform for small businesses',
    location: 'São Paulo',
    customTags: ['Collaborator', 'Sales Expert'],
    addedDaysAgo: 9
  }, {
    id: '8',
    name: 'James Wilson',
    role: 'Operations',
    company: 'LogiTech Solutions',
    currentProject: 'Optimizing supply chain operations using IoT and data analytics',
    location: 'London',
    customTags: ['Potential co-founder', 'Operations'],
    addedDaysAgo: 21
  }]);

  // Predefined tags
  const predefinedTags = ['Potential co-founder', 'Interesting investor', 'Future hire', 'Mentor', 'Collaborator'];

  // Get all unique tags from profiles and predefined tags
  const allTags = useMemo(() => {
    const profileTags = bookmarkedProfiles.flatMap(profile => profile.customTags);
    return [...new Set([...predefinedTags, ...profileTags])];
  }, [bookmarkedProfiles]);

  // Filter and sort profiles
  const filteredAndSortedProfiles = useMemo(() => {
    let filtered = bookmarkedProfiles.filter(profile => {
      const matchesSearch = searchQuery === '' || profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || profile.role.toLowerCase().includes(searchQuery.toLowerCase()) || profile.company.toLowerCase().includes(searchQuery.toLowerCase()) || profile.currentProject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => profile.customTags.includes(tag));
      return matchesSearch && matchesTags;
    });

    // Sort profiles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'recent':
        default:
          return a.addedDaysAgo - b.addedDaysAgo;
      }
    });
    return filtered;
  }, [bookmarkedProfiles, searchQuery, selectedTags, sortBy]);
  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const toggleProfileSelection = (profileId: string) => {
    setSelectedProfiles(prev => prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]);
  };
  const selectAllProfiles = () => {
    setSelectedProfiles(filteredAndSortedProfiles.map(p => p.id));
  };
  const deselectAllProfiles = () => {
    setSelectedProfiles([]);
  };
  const removeSelectedBookmarks = () => {
    setBookmarkedProfiles(prev => prev.filter(profile => !selectedProfiles.includes(profile.id)));
    setSelectedProfiles([]);
    setShowBulkActions(false);
  };
  const removeBookmark = (profileId: string) => {
    setBookmarkedProfiles(prev => prev.filter(profile => profile.id !== profileId));
  };
  const addTagToProfile = (profileId: string, tag: string) => {
    setBookmarkedProfiles(prev => prev.map(profile => profile.id === profileId ? {
      ...profile,
      customTags: [...new Set([...profile.customTags, tag])]
    } : profile));
  };
  const removeTagFromProfile = (profileId: string, tag: string) => {
    setBookmarkedProfiles(prev => prev.map(profile => profile.id === profileId ? {
      ...profile,
      customTags: profile.customTags.filter(t => t !== tag)
    } : profile));
  };
  const addNewTag = () => {
    if (newTagInput.trim() && editingTags) {
      addTagToProfile(editingTags, newTagInput.trim());
      setNewTagInput('');
      setShowNewTagInput(false);
    }
  };
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('recent');
  };
  const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0;
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StartupEcosystem.in
            </h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-lg font-light hover:text-gray-600 transition-colors">Home</a>
              <a href="#" className="text-lg font-light hover:text-gray-600 transition-colors">Opportunities</a>
              <a href="#" className="text-lg font-light hover:text-gray-600 transition-colors">Browse Profiles</a>
              <a href="#" className="text-lg font-semibold border-b-2 border-black">My Bookmarks</a>
            </nav>
          </div>
          
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
              My Bookmarks
            </h2>
            <p className="text-xl md:text-2xl font-light max-w-3xl">
              Manage and organize your saved professional connections for easy access and networking.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Search, Filters, and Sort */}
      <section className="px-6 py-8 md:px-12 lg:px-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search bookmarks by name, role, or project..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              {/* Filter Toggle */}
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 hover:border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10">
                <Filter size={20} />
                <span className="font-semibold">Filter by Tags</span>
                {selectedTags.length > 0 && <span className="bg-black text-white px-2 py-1 text-xs rounded-full">
                    {selectedTags.length}
                  </span>}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 hover:border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10">
                  <span className="font-semibold">
                    Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'name' ? 'Name' : 'Role'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                <AnimatePresence>
                  {showSortDropdown && <motion.div initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 shadow-lg z-10 min-w-full">
                      {[{
                    value: 'recent',
                    label: 'Recent'
                  }, {
                    value: 'name',
                    label: 'Name'
                  }, {
                    value: 'role',
                    label: 'Role'
                  }].map(option => <button key={option.value} onClick={() => {
                    setSortBy(option.value as 'recent' | 'name' | 'role');
                    setShowSortDropdown(false);
                  }} className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors">
                          {option.label}
                        </button>)}
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && <button onClick={clearAllFilters} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
                <X size={16} />
                <span>Clear all filters</span>
              </button>}
          </div>

          {/* Tag Filters */}
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
          }} className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => <button key={tag} onClick={() => toggleTagFilter(tag)} className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedTags.includes(tag) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>
                      {tag}
                    </button>)}
                </div>
              </motion.div>}
          </AnimatePresence>

          {/* Bulk Actions */}
          {selectedProfiles.length > 0 && <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="bg-black text-white p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">
                  {selectedProfiles.length} profile{selectedProfiles.length > 1 ? 's' : ''} selected
                </span>
                <button onClick={selectAllProfiles} className="text-sm underline hover:no-underline">
                  Select All
                </button>
                <button onClick={deselectAllProfiles} className="text-sm underline hover:no-underline">
                  Deselect All
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={removeSelectedBookmarks} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 transition-colors">
                  <Trash2 size={16} />
                  <span>Remove Selected</span>
                </button>
              </div>
            </motion.div>}
        </div>
      </section>

      {/* Results */}
      <section className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold">
              {filteredAndSortedProfiles.length} Bookmark{filteredAndSortedProfiles.length !== 1 ? 's' : ''}
            </h3>
          </div>

          {/* Empty State */}
          {filteredAndSortedProfiles.length === 0 && bookmarkedProfiles.length === 0 && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center py-16">
              <Users size={64} className="mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-semibold mb-4">No bookmarks yet</h3>
              <p className="text-lg text-gray-600 mb-6">
                Browse profiles to start building your network!
              </p>
              <button className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200">
                Browse Profiles
              </button>
            </motion.div>}

          {/* No Results State */}
          {filteredAndSortedProfiles.length === 0 && bookmarkedProfiles.length > 0 && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center py-16">
              <Search size={64} className="mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-semibold mb-4">No bookmarks found</h3>
              <p className="text-lg text-gray-600 mb-6">
                Try adjusting your search criteria or clearing some filters.
              </p>
              {hasActiveFilters && <button onClick={clearAllFilters} className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-all duration-200">
                  Clear All Filters
                </button>}
            </motion.div>}

          {/* Bookmarks Grid */}
          {filteredAndSortedProfiles.length > 0 && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5
        }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProfiles.map((profile, index) => <motion.div key={profile.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className={`bg-white border-2 p-6 hover:border-black transition-all duration-300 group relative ${selectedProfiles.includes(profile.id) ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4">
                    <button onClick={() => toggleProfileSelection(profile.id)} className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-200 ${selectedProfiles.includes(profile.id) ? 'bg-black border-black' : 'border-gray-300 hover:border-black'}`}>
                      {selectedProfiles.includes(profile.id) && <Check size={12} className="text-white" />}
                    </button>
                  </div>

                  {/* Remove Bookmark */}
                  <div className="absolute top-4 right-4">
                    <button onClick={() => removeBookmark(profile.id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center space-x-4 mb-4 mt-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                      <User size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{profile.name}</h4>
                      <p className="text-gray-600 flex items-center space-x-1">
                        <Briefcase size={14} />
                        <span>{profile.role}</span>
                      </p>
                    </div>
                  </div>

                  {/* Company and Location */}
                  <div className="mb-4 space-y-1">
                    <p className="flex items-center space-x-1 text-gray-600">
                      <Building size={14} />
                      <span>{profile.company}</span>
                    </p>
                    {profile.location && <p className="flex items-center space-x-1 text-gray-600">
                        <MapPin size={14} />
                        <span>{profile.location}</span>
                      </p>}
                  </div>

                  {/* Current Project */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Currently building:</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {profile.currentProject}
                    </p>
                  </div>

                  {/* Custom Tags */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-800">Tags:</p>
                      <button onClick={() => setEditingTags(editingTags === profile.id ? null : profile.id)} className="text-xs text-gray-500 hover:text-black transition-colors">
                        <Tag size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.customTags.map(tag => <div key={tag} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                          <span>{tag}</span>
                          {editingTags === profile.id && <button onClick={() => removeTagFromProfile(profile.id, tag)} className="text-gray-400 hover:text-red-500">
                              <X size={10} />
                            </button>}
                        </div>)}
                      
                      {/* Add New Tag */}
                      {editingTags === profile.id && <div className="flex items-center space-x-2">
                          {!showNewTagInput ? <button onClick={() => setShowNewTagInput(true)} className="flex items-center space-x-1 px-2 py-1 border-2 border-dashed border-gray-300 text-gray-500 hover:border-black hover:text-black transition-all duration-200">
                              <Plus size={10} />
                              <span className="text-xs">Add Tag</span>
                            </button> : <div className="flex items-center space-x-1">
                              <input type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addNewTag()} className="w-20 px-2 py-1 text-xs border border-gray-300 focus:border-black focus:outline-none" placeholder="New tag" autoFocus />
                              <button onClick={addNewTag} className="text-green-600 hover:text-green-700">
                                <Check size={12} />
                              </button>
                              <button onClick={() => {
                      setShowNewTagInput(false);
                      setNewTagInput('');
                    }} className="text-gray-400 hover:text-red-500">
                                <X size={12} />
                              </button>
                            </div>}
                        </div>}
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="mb-6">
                    <p className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>Added {profile.addedDaysAgo} day{profile.addedDaysAgo !== 1 ? 's' : ''} ago</span>
                    </p>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-900 transition-all duration-200 group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20">
                    View Profile
                  </button>
                </motion.div>)}
            </motion.div>}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default BookmarksManagementPage;