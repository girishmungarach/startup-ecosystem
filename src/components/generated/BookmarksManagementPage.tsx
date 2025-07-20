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
  mpid?: string;
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
    addedDaysAgo: 3,
    mpid: "e3d45653-a04e-4431-abcd-4c4844647a87"
  }, {
    id: '2',
    name: 'Rajesh Kumar',
    role: 'Developer',
    company: 'Fintech Solutions',
    currentProject: 'Developing a blockchain-based payment system for rural banking',
    location: 'Bangalore',
    customTags: ['Future hire', 'Blockchain Expert'],
    addedDaysAgo: 7,
    mpid: "f0af4148-8619-4a8c-ae28-7da34403316d"
  }, {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Investor',
    company: 'Venture Capital Partners',
    currentProject: 'Looking for promising EdTech startups to invest in Series A rounds',
    location: 'New York',
    customTags: ['Interesting investor', 'Series A'],
    addedDaysAgo: 12,
    mpid: "5dc60efd-db20-4837-8552-65ffb336bae6"
  }, {
    id: '4',
    name: 'David Park',
    role: 'Designer',
    company: 'Creative Studio',
    currentProject: 'Designing user experiences for sustainable agriculture mobile apps',
    location: 'Seoul',
    customTags: ['Collaborator', 'UX Expert'],
    addedDaysAgo: 5,
    mpid: "4d0d33a1-6f34-4ad9-b723-7fb497dfa832"
  }, {
    id: '5',
    name: 'Priya Sharma',
    role: 'Marketing',
    company: 'Growth Hackers Inc',
    currentProject: 'Exploring growth strategies for B2B SaaS companies in emerging markets',
    location: 'Mumbai',
    customTags: ['Mentor', 'Growth Expert'],
    addedDaysAgo: 15,
    mpid: "d04b804a-bd3d-4d35-974b-f7bf65ac79b4"
  }, {
    id: '6',
    name: 'Alex Thompson',
    role: 'Student',
    company: 'Stanford University',
    currentProject: 'Researching machine learning applications in gaming and entertainment',
    location: 'Palo Alto',
    customTags: ['Future hire', 'AI Research'],
    addedDaysAgo: 2,
    mpid: "f248be48-15d2-4165-8c57-8e82aedb0a1f"
  }, {
    id: '7',
    name: 'Maria Santos',
    role: 'Sales',
    company: 'TechSales Pro',
    currentProject: 'Building a sales automation platform for small businesses',
    location: 'São Paulo',
    customTags: ['Collaborator', 'Sales Expert'],
    addedDaysAgo: 9,
    mpid: "e66c9422-2d6d-4b22-8a7d-4ce6f2a0bf74"
  }, {
    id: '8',
    name: 'James Wilson',
    role: 'Operations',
    company: 'LogiTech Solutions',
    currentProject: 'Optimizing supply chain operations using IoT and data analytics',
    location: 'London',
    customTags: ['Potential co-founder', 'Operations'],
    addedDaysAgo: 21,
    mpid: "fd29ed85-663c-402f-926d-1a0048f80452"
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
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="0" data-magicpath-path="BookmarksManagementPage.tsx">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="1" data-magicpath-path="BookmarksManagementPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="BookmarksManagementPage.tsx">
          <div className="flex items-center justify-between mb-8" data-magicpath-id="3" data-magicpath-path="BookmarksManagementPage.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="4" data-magicpath-path="BookmarksManagementPage.tsx">
              StartupEcosystem.in
            </h1>
            <nav className="hidden md:flex space-x-8" data-magicpath-id="5" data-magicpath-path="BookmarksManagementPage.tsx">
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
        }} data-magicpath-id="6" data-magicpath-path="BookmarksManagementPage.tsx">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" data-magicpath-id="7" data-magicpath-path="BookmarksManagementPage.tsx">
              My Bookmarks
            </h2>
            <p className="text-xl md:text-2xl font-light max-w-3xl" data-magicpath-id="8" data-magicpath-path="BookmarksManagementPage.tsx">
              Manage and organize your saved professional connections for easy access and networking.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Search, Filters, and Sort */}
      <section className="px-6 py-8 md:px-12 lg:px-24 bg-gray-50 border-b border-gray-200" data-magicpath-id="9" data-magicpath-path="BookmarksManagementPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="10" data-magicpath-path="BookmarksManagementPage.tsx">
          {/* Search Bar */}
          <div className="relative mb-6" data-magicpath-id="11" data-magicpath-path="BookmarksManagementPage.tsx">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} data-magicpath-id="12" data-magicpath-path="BookmarksManagementPage.tsx" />
            <input type="text" placeholder="Search bookmarks by name, role, or project..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" data-magicpath-id="13" data-magicpath-path="BookmarksManagementPage.tsx" />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6" data-magicpath-id="14" data-magicpath-path="BookmarksManagementPage.tsx">
            <div className="flex items-center space-x-4" data-magicpath-id="15" data-magicpath-path="BookmarksManagementPage.tsx">
              {/* Filter Toggle */}
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 hover:border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-id="16" data-magicpath-path="BookmarksManagementPage.tsx">
                <Filter size={20} data-magicpath-id="17" data-magicpath-path="BookmarksManagementPage.tsx" />
                <span className="font-semibold" data-magicpath-id="18" data-magicpath-path="BookmarksManagementPage.tsx">Filter by Tags</span>
                {selectedTags.length > 0 && <span className="bg-black text-white px-2 py-1 text-xs rounded-full" data-magicpath-id="19" data-magicpath-path="BookmarksManagementPage.tsx">
                    {selectedTags.length}
                  </span>}
              </button>

              {/* Sort Dropdown */}
              <div className="relative" data-magicpath-id="20" data-magicpath-path="BookmarksManagementPage.tsx">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 hover:border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-id="21" data-magicpath-path="BookmarksManagementPage.tsx">
                  <span className="font-semibold" data-magicpath-id="22" data-magicpath-path="BookmarksManagementPage.tsx">
                    Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'name' ? 'Name' : 'Role'}
                  </span>
                  <ChevronDown size={16} data-magicpath-id="23" data-magicpath-path="BookmarksManagementPage.tsx" />
                </button>
                
                <AnimatePresence data-magicpath-id="24" data-magicpath-path="BookmarksManagementPage.tsx">
                  {showSortDropdown && <motion.div initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 shadow-lg z-10 min-w-full" data-magicpath-id="25" data-magicpath-path="BookmarksManagementPage.tsx">
                      {[{
                    value: 'recent',
                    label: 'Recent',
                    mpid: "30c37cf6-7725-41a5-ad94-8c1f38f5b7be"
                  }, {
                    value: 'name',
                    label: 'Name',
                    mpid: "81e096e8-dccd-4100-a5f9-a5fce1c70a8f"
                  }, {
                    value: 'role',
                    label: 'Role',
                    mpid: "200bf9eb-b70c-47a4-85d4-e7095742efdc"
                  }].map(option => <button key={option.value} onClick={() => {
                    setSortBy(option.value as 'recent' | 'name' | 'role');
                    setShowSortDropdown(false);
                  }} className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors" data-magicpath-uuid={(option as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="26" data-magicpath-path="BookmarksManagementPage.tsx">
                          {option.label}
                        </button>)}
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && <button onClick={clearAllFilters} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors" data-magicpath-id="27" data-magicpath-path="BookmarksManagementPage.tsx">
                <X size={16} data-magicpath-id="28" data-magicpath-path="BookmarksManagementPage.tsx" />
                <span data-magicpath-id="29" data-magicpath-path="BookmarksManagementPage.tsx">Clear all filters</span>
              </button>}
          </div>

          {/* Tag Filters */}
          <AnimatePresence data-magicpath-id="30" data-magicpath-path="BookmarksManagementPage.tsx">
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
          }} className="mb-6" data-magicpath-id="31" data-magicpath-path="BookmarksManagementPage.tsx">
                <h3 className="text-lg font-semibold mb-3" data-magicpath-id="32" data-magicpath-path="BookmarksManagementPage.tsx">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2" data-magicpath-id="33" data-magicpath-path="BookmarksManagementPage.tsx">
                  {allTags.map(tag => <button key={tag} onClick={() => toggleTagFilter(tag)} className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedTags.includes(tag) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`} data-magicpath-uuid={(tag as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="BookmarksManagementPage.tsx">
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
        }} className="bg-black text-white p-4 mb-6 flex items-center justify-between" data-magicpath-id="35" data-magicpath-path="BookmarksManagementPage.tsx">
              <div className="flex items-center space-x-4" data-magicpath-id="36" data-magicpath-path="BookmarksManagementPage.tsx">
                <span className="font-semibold" data-magicpath-id="37" data-magicpath-path="BookmarksManagementPage.tsx">
                  {selectedProfiles.length} profile{selectedProfiles.length > 1 ? 's' : ''} selected
                </span>
                <button onClick={selectAllProfiles} className="text-sm underline hover:no-underline" data-magicpath-id="38" data-magicpath-path="BookmarksManagementPage.tsx">
                  Select All
                </button>
                <button onClick={deselectAllProfiles} className="text-sm underline hover:no-underline" data-magicpath-id="39" data-magicpath-path="BookmarksManagementPage.tsx">
                  Deselect All
                </button>
              </div>
              <div className="flex items-center space-x-2" data-magicpath-id="40" data-magicpath-path="BookmarksManagementPage.tsx">
                <button onClick={removeSelectedBookmarks} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 transition-colors" data-magicpath-id="41" data-magicpath-path="BookmarksManagementPage.tsx">
                  <Trash2 size={16} data-magicpath-id="42" data-magicpath-path="BookmarksManagementPage.tsx" />
                  <span data-magicpath-id="43" data-magicpath-path="BookmarksManagementPage.tsx">Remove Selected</span>
                </button>
              </div>
            </motion.div>}
        </div>
      </section>

      {/* Results */}
      <section className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="44" data-magicpath-path="BookmarksManagementPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="45" data-magicpath-path="BookmarksManagementPage.tsx">
          <div className="flex items-center justify-between mb-8" data-magicpath-id="46" data-magicpath-path="BookmarksManagementPage.tsx">
            <h3 className="text-2xl font-semibold" data-magicpath-id="47" data-magicpath-path="BookmarksManagementPage.tsx">
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
        }} className="text-center py-16" data-magicpath-id="48" data-magicpath-path="BookmarksManagementPage.tsx">
              <Users size={64} className="mx-auto mb-6 text-gray-400" data-magicpath-id="49" data-magicpath-path="BookmarksManagementPage.tsx" />
              <h3 className="text-2xl font-semibold mb-4" data-magicpath-id="50" data-magicpath-path="BookmarksManagementPage.tsx">No bookmarks yet</h3>
              <p className="text-lg text-gray-600 mb-6" data-magicpath-id="51" data-magicpath-path="BookmarksManagementPage.tsx">
                Browse profiles to start building your network!
              </p>
              <button className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200" data-magicpath-id="52" data-magicpath-path="BookmarksManagementPage.tsx">
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
        }} className="text-center py-16" data-magicpath-id="53" data-magicpath-path="BookmarksManagementPage.tsx">
              <Search size={64} className="mx-auto mb-6 text-gray-400" data-magicpath-id="54" data-magicpath-path="BookmarksManagementPage.tsx" />
              <h3 className="text-2xl font-semibold mb-4" data-magicpath-id="55" data-magicpath-path="BookmarksManagementPage.tsx">No bookmarks found</h3>
              <p className="text-lg text-gray-600 mb-6" data-magicpath-id="56" data-magicpath-path="BookmarksManagementPage.tsx">
                Try adjusting your search criteria or clearing some filters.
              </p>
              {hasActiveFilters && <button onClick={clearAllFilters} className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-all duration-200" data-magicpath-id="57" data-magicpath-path="BookmarksManagementPage.tsx">
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
        }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-magicpath-id="58" data-magicpath-path="BookmarksManagementPage.tsx">
              {filteredAndSortedProfiles.map((profile, index) => <motion.div key={profile.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className={`bg-white border-2 p-6 hover:border-black transition-all duration-300 group relative ${selectedProfiles.includes(profile.id) ? 'border-black bg-gray-50' : 'border-gray-200'}`} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="59" data-magicpath-path="BookmarksManagementPage.tsx">
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="60" data-magicpath-path="BookmarksManagementPage.tsx">
                    <button onClick={() => toggleProfileSelection(profile.id)} className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-200 ${selectedProfiles.includes(profile.id) ? 'bg-black border-black' : 'border-gray-300 hover:border-black'}`} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="61" data-magicpath-path="BookmarksManagementPage.tsx">
                      {selectedProfiles.includes(profile.id) && <Check size={12} className="text-white" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="62" data-magicpath-path="BookmarksManagementPage.tsx" />}
                    </button>
                  </div>

                  {/* Remove Bookmark */}
                  <div className="absolute top-4 right-4" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="63" data-magicpath-path="BookmarksManagementPage.tsx">
                    <button onClick={() => removeBookmark(profile.id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors opacity-0 group-hover:opacity-100" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="64" data-magicpath-path="BookmarksManagementPage.tsx">
                      <Trash2 size={16} className="text-gray-400 hover:text-red-500" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="65" data-magicpath-path="BookmarksManagementPage.tsx" />
                    </button>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center space-x-4 mb-4 mt-6" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="66" data-magicpath-path="BookmarksManagementPage.tsx">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="BookmarksManagementPage.tsx">
                      <User size={24} className="text-gray-400" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="68" data-magicpath-path="BookmarksManagementPage.tsx" />
                    </div>
                    <div data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="69" data-magicpath-path="BookmarksManagementPage.tsx">
                      <h4 className="text-xl font-bold" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="70" data-magicpath-path="BookmarksManagementPage.tsx">{profile.name}</h4>
                      <p className="text-gray-600 flex items-center space-x-1" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="71" data-magicpath-path="BookmarksManagementPage.tsx">
                        <Briefcase size={14} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="72" data-magicpath-path="BookmarksManagementPage.tsx" />
                        <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="role:unknown" data-magicpath-id="73" data-magicpath-path="BookmarksManagementPage.tsx">{profile.role}</span>
                      </p>
                    </div>
                  </div>

                  {/* Company and Location */}
                  <div className="mb-4 space-y-1" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="74" data-magicpath-path="BookmarksManagementPage.tsx">
                    <p className="flex items-center space-x-1 text-gray-600" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="75" data-magicpath-path="BookmarksManagementPage.tsx">
                      <Building size={14} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="76" data-magicpath-path="BookmarksManagementPage.tsx" />
                      <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="company:unknown" data-magicpath-id="77" data-magicpath-path="BookmarksManagementPage.tsx">{profile.company}</span>
                    </p>
                    {profile.location && <p className="flex items-center space-x-1 text-gray-600" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="78" data-magicpath-path="BookmarksManagementPage.tsx">
                        <MapPin size={14} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="79" data-magicpath-path="BookmarksManagementPage.tsx" />
                        <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="location:unknown" data-magicpath-id="80" data-magicpath-path="BookmarksManagementPage.tsx">{profile.location}</span>
                      </p>}
                  </div>

                  {/* Current Project */}
                  <div className="mb-4" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="81" data-magicpath-path="BookmarksManagementPage.tsx">
                    <p className="text-sm font-semibold text-gray-800 mb-2" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="82" data-magicpath-path="BookmarksManagementPage.tsx">Currently building:</p>
                    <p className="text-sm text-gray-600 leading-relaxed" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="currentProject:unknown" data-magicpath-id="83" data-magicpath-path="BookmarksManagementPage.tsx">
                      {profile.currentProject}
                    </p>
                  </div>

                  {/* Custom Tags */}
                  <div className="mb-4" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="84" data-magicpath-path="BookmarksManagementPage.tsx">
                    <div className="flex items-center justify-between mb-2" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="85" data-magicpath-path="BookmarksManagementPage.tsx">
                      <p className="text-sm font-semibold text-gray-800" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="86" data-magicpath-path="BookmarksManagementPage.tsx">Tags:</p>
                      <button onClick={() => setEditingTags(editingTags === profile.id ? null : profile.id)} className="text-xs text-gray-500 hover:text-black transition-colors" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="87" data-magicpath-path="BookmarksManagementPage.tsx">
                        <Tag size={14} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="88" data-magicpath-path="BookmarksManagementPage.tsx" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="89" data-magicpath-path="BookmarksManagementPage.tsx">
                      {profile.customTags.map(tag => <div key={tag} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="90" data-magicpath-path="BookmarksManagementPage.tsx">
                          <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="91" data-magicpath-path="BookmarksManagementPage.tsx">{tag}</span>
                          {editingTags === profile.id && <button onClick={() => removeTagFromProfile(profile.id, tag)} className="text-gray-400 hover:text-red-500" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="92" data-magicpath-path="BookmarksManagementPage.tsx">
                              <X size={10} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="93" data-magicpath-path="BookmarksManagementPage.tsx" />
                            </button>}
                        </div>)}
                      
                      {/* Add New Tag */}
                      {editingTags === profile.id && <div className="flex items-center space-x-2" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="94" data-magicpath-path="BookmarksManagementPage.tsx">
                          {!showNewTagInput ? <button onClick={() => setShowNewTagInput(true)} className="flex items-center space-x-1 px-2 py-1 border-2 border-dashed border-gray-300 text-gray-500 hover:border-black hover:text-black transition-all duration-200" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="95" data-magicpath-path="BookmarksManagementPage.tsx">
                              <Plus size={10} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="96" data-magicpath-path="BookmarksManagementPage.tsx" />
                              <span className="text-xs" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="97" data-magicpath-path="BookmarksManagementPage.tsx">Add Tag</span>
                            </button> : <div className="flex items-center space-x-1" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="98" data-magicpath-path="BookmarksManagementPage.tsx">
                              <input type="text" value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addNewTag()} className="w-20 px-2 py-1 text-xs border border-gray-300 focus:border-black focus:outline-none" placeholder="New tag" autoFocus data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="99" data-magicpath-path="BookmarksManagementPage.tsx" />
                              <button onClick={addNewTag} className="text-green-600 hover:text-green-700" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="100" data-magicpath-path="BookmarksManagementPage.tsx">
                                <Check size={12} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="101" data-magicpath-path="BookmarksManagementPage.tsx" />
                              </button>
                              <button onClick={() => {
                      setShowNewTagInput(false);
                      setNewTagInput('');
                    }} className="text-gray-400 hover:text-red-500" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="102" data-magicpath-path="BookmarksManagementPage.tsx">
                                <X size={12} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="103" data-magicpath-path="BookmarksManagementPage.tsx" />
                              </button>
                            </div>}
                        </div>}
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="mb-6" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="104" data-magicpath-path="BookmarksManagementPage.tsx">
                    <p className="flex items-center space-x-1 text-xs text-gray-500" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="105" data-magicpath-path="BookmarksManagementPage.tsx">
                      <Calendar size={12} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="106" data-magicpath-path="BookmarksManagementPage.tsx" />
                      <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="addedDaysAgo:unknown" data-magicpath-id="107" data-magicpath-path="BookmarksManagementPage.tsx">Added {profile.addedDaysAgo} day{profile.addedDaysAgo !== 1 ? 's' : ''} ago</span>
                    </p>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-900 transition-all duration-200 group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="108" data-magicpath-path="BookmarksManagementPage.tsx">
                    View Profile
                  </button>
                </motion.div>)}
            </motion.div>}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="109" data-magicpath-path="BookmarksManagementPage.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="110" data-magicpath-path="BookmarksManagementPage.tsx">
          <p className="text-lg font-light" data-magicpath-id="111" data-magicpath-path="BookmarksManagementPage.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default BookmarksManagementPage;