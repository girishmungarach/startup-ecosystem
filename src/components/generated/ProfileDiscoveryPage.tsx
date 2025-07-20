"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, User, MapPin, Building, Briefcase, X, Loader2 } from 'lucide-react';
interface Profile {
  id: string;
  name: string;
  role: string;
  company: string;
  currentProject: string;
  interests: string[];
  buildingStatus: 'Actively building' | 'Exploring ideas' | 'Looking for opportunities';
  profileImage?: string;
  isBookmarked: boolean;
  location?: string;
  mpid?: string;
}
const ProfileDiscoveryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedBuildingStatus, setSelectedBuildingStatus] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([{
    id: '1',
    name: 'Sarah Chen',
    role: 'Founder',
    company: 'HealthTech Innovations',
    currentProject: 'Building an AI-powered diagnostic platform for early disease detection',
    interests: ['HealthTech', 'AI/ML'],
    buildingStatus: 'Actively building',
    isBookmarked: false,
    location: 'San Francisco',
    mpid: "321dc50e-5302-441c-809f-c3fa56c441af"
  }, {
    id: '2',
    name: 'Rajesh Kumar',
    role: 'Developer',
    company: 'Fintech Solutions',
    currentProject: 'Developing a blockchain-based payment system for rural banking',
    interests: ['Fintech', 'SaaS'],
    buildingStatus: 'Actively building',
    isBookmarked: true,
    location: 'Bangalore',
    mpid: "e8eec72b-d7b3-4db0-9cfe-f55068fdb7ae"
  }, {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Investor',
    company: 'Venture Capital Partners',
    currentProject: 'Looking for promising EdTech startups to invest in Series A rounds',
    interests: ['EdTech', 'SaaS'],
    buildingStatus: 'Looking for opportunities',
    isBookmarked: false,
    location: 'New York',
    mpid: "b99051ca-5f3b-4651-b37e-de78a73e0a4e"
  }, {
    id: '4',
    name: 'David Park',
    role: 'Designer',
    company: 'Creative Studio',
    currentProject: 'Designing user experiences for sustainable agriculture mobile apps',
    interests: ['AgriTech', 'E-commerce'],
    buildingStatus: 'Actively building',
    isBookmarked: false,
    location: 'Seoul',
    mpid: "bb903747-04a5-44c3-b9ad-a7a0bf9ef1c2"
  }, {
    id: '5',
    name: 'Priya Sharma',
    role: 'Marketing',
    company: 'Growth Hackers Inc',
    currentProject: 'Exploring growth strategies for B2B SaaS companies in emerging markets',
    interests: ['SaaS', 'Fintech'],
    buildingStatus: 'Exploring ideas',
    isBookmarked: true,
    location: 'Mumbai',
    mpid: "c8c6f6c9-eebb-4449-abec-641a0c66aba0"
  }, {
    id: '6',
    name: 'Alex Thompson',
    role: 'Student',
    company: 'Stanford University',
    currentProject: 'Researching machine learning applications in gaming and entertainment',
    interests: ['Gaming', 'AI/ML'],
    buildingStatus: 'Exploring ideas',
    isBookmarked: false,
    location: 'Palo Alto',
    mpid: "d84baf25-ac84-458a-a0b6-717b2f066327"
  }, {
    id: '7',
    name: 'Maria Santos',
    role: 'Sales',
    company: 'TechSales Pro',
    currentProject: 'Building a sales automation platform for small businesses',
    interests: ['SaaS', 'E-commerce'],
    buildingStatus: 'Actively building',
    isBookmarked: false,
    location: 'São Paulo',
    mpid: "0219db5b-cc00-43b8-81fb-ffac89ae0ad4"
  }, {
    id: '8',
    name: 'James Wilson',
    role: 'Operations',
    company: 'LogiTech Solutions',
    currentProject: 'Optimizing supply chain operations using IoT and data analytics',
    interests: ['AgriTech', 'AI/ML'],
    buildingStatus: 'Actively building',
    isBookmarked: false,
    location: 'London',
    mpid: "2ab7f214-b695-4039-8012-76becf354b33"
  }, {
    id: '9',
    name: 'Lisa Zhang',
    role: 'Founder',
    company: 'EduInnovate',
    currentProject: 'Creating personalized learning experiences for K-12 students',
    interests: ['EdTech', 'AI/ML'],
    buildingStatus: 'Actively building',
    isBookmarked: true,
    location: 'Toronto',
    mpid: "f07aeb4d-5bbd-4a55-a3aa-dd17fc7694ef"
  }, {
    id: '10',
    name: 'Ahmed Hassan',
    role: 'Developer',
    company: 'Blockchain Builders',
    currentProject: 'Developing decentralized finance solutions for the Middle East',
    interests: ['Fintech', 'Other'],
    buildingStatus: 'Actively building',
    isBookmarked: false,
    location: 'Dubai',
    mpid: "da233c1b-5f46-436f-8048-73453fa10ec8"
  }]);
  const roleOptions = ['All', 'Founders', 'Investors', 'Developers', 'Designers', 'Marketing', 'Sales', 'Operations', 'Students'];
  const interestOptions = ['Fintech', 'HealthTech', 'EdTech', 'AI/ML', 'SaaS', 'E-commerce', 'Gaming', 'AgriTech', 'Other'];
  const buildingStatusOptions = ['All', 'Actively building', 'Exploring ideas', 'Looking for opportunities'];
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = searchQuery === '' || profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || profile.company.toLowerCase().includes(searchQuery.toLowerCase()) || profile.currentProject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRoles.length === 0 || selectedRoles.includes('All') || selectedRoles.some(role => {
        if (role === 'Founders') return profile.role === 'Founder';
        if (role === 'Investors') return profile.role === 'Investor';
        if (role === 'Developers') return profile.role === 'Developer';
        if (role === 'Designers') return profile.role === 'Designer';
        if (role === 'Students') return profile.role === 'Student';
        return profile.role === role;
      });
      const matchesInterests = selectedInterests.length === 0 || selectedInterests.some(interest => profile.interests.includes(interest));
      const matchesBuildingStatus = selectedBuildingStatus.length === 0 || selectedBuildingStatus.includes('All') || selectedBuildingStatus.includes(profile.buildingStatus);
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
  const toggleBookmark = (profileId: string) => {
    setProfiles(prev => prev.map(profile => profile.id === profileId ? {
      ...profile,
      isBookmarked: !profile.isBookmarked
    } : profile));
  };
  const clearAllFilters = () => {
    setSelectedRoles([]);
    setSelectedInterests([]);
    setSelectedBuildingStatus([]);
    setSearchQuery('');
  };
  const hasActiveFilters = selectedRoles.length > 0 || selectedInterests.length > 0 || selectedBuildingStatus.length > 0 || searchQuery !== '';
  const SkeletonCard = () => <div className="bg-white border-2 border-gray-200 p-6 animate-pulse" data-magicpath-id="0" data-magicpath-path="ProfileDiscoveryPage.tsx">
      <div className="flex items-center space-x-4 mb-4" data-magicpath-id="1" data-magicpath-path="ProfileDiscoveryPage.tsx">
        <div className="w-16 h-16 bg-gray-200 rounded-full" data-magicpath-id="2" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
        <div className="flex-1" data-magicpath-id="3" data-magicpath-path="ProfileDiscoveryPage.tsx">
          <div className="h-4 bg-gray-200 rounded mb-2" data-magicpath-id="4" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4" data-magicpath-id="5" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4" data-magicpath-id="6" data-magicpath-path="ProfileDiscoveryPage.tsx">
        <div className="h-3 bg-gray-200 rounded" data-magicpath-id="7" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6" data-magicpath-id="8" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
      </div>
      <div className="flex space-x-2 mb-4" data-magicpath-id="9" data-magicpath-path="ProfileDiscoveryPage.tsx">
        <div className="h-6 bg-gray-200 rounded w-16" data-magicpath-id="10" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
        <div className="h-6 bg-gray-200 rounded w-20" data-magicpath-id="11" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded" data-magicpath-id="12" data-magicpath-path="ProfileDiscoveryPage.tsx"></div>
    </div>;
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="13" data-magicpath-path="ProfileDiscoveryPage.tsx">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="14" data-magicpath-path="ProfileDiscoveryPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="15" data-magicpath-path="ProfileDiscoveryPage.tsx">
          <div className="flex items-center justify-between mb-8" data-magicpath-id="16" data-magicpath-path="ProfileDiscoveryPage.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="17" data-magicpath-path="ProfileDiscoveryPage.tsx">
              StartupEcosystem.in
            </h1>
            <nav className="hidden md:flex space-x-8" data-magicpath-id="18" data-magicpath-path="ProfileDiscoveryPage.tsx">
              <a href="#" className="text-lg font-light hover:text-gray-600 transition-colors">Home</a>
              <a href="#" className="text-lg font-light hover:text-gray-600 transition-colors">Opportunities</a>
              <a href="#" className="text-lg font-semibold border-b-2 border-black">Browse Profiles</a>
              <a href="#" className="text-lg font-light hover:text-gray-600 transition-colors">About</a>
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
        }} data-magicpath-id="19" data-magicpath-path="ProfileDiscoveryPage.tsx">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" data-magicpath-id="20" data-magicpath-path="ProfileDiscoveryPage.tsx">
              Discover Profiles
            </h2>
            <p className="text-xl md:text-2xl font-light max-w-3xl" data-magicpath-id="21" data-magicpath-path="ProfileDiscoveryPage.tsx">
              Connect with founders, investors, developers, and innovators building the future of technology.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="px-6 py-8 md:px-12 lg:px-24 bg-gray-50 border-b border-gray-200" data-magicpath-id="22" data-magicpath-path="ProfileDiscoveryPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="23" data-magicpath-path="ProfileDiscoveryPage.tsx">
          {/* Search Bar */}
          <div className="relative mb-6" data-magicpath-id="24" data-magicpath-path="ProfileDiscoveryPage.tsx">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} data-magicpath-id="25" data-magicpath-path="ProfileDiscoveryPage.tsx" />
            <input type="text" placeholder="Search by name, company, or project..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" data-magicpath-id="26" data-magicpath-path="ProfileDiscoveryPage.tsx" />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-6" data-magicpath-id="27" data-magicpath-path="ProfileDiscoveryPage.tsx">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 hover:border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-id="28" data-magicpath-path="ProfileDiscoveryPage.tsx">
              <Filter size={20} data-magicpath-id="29" data-magicpath-path="ProfileDiscoveryPage.tsx" />
              <span className="font-semibold" data-magicpath-id="30" data-magicpath-path="ProfileDiscoveryPage.tsx">Filters</span>
            </button>
            
            {hasActiveFilters && <button onClick={clearAllFilters} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors" data-magicpath-id="31" data-magicpath-path="ProfileDiscoveryPage.tsx">
                <X size={16} data-magicpath-id="32" data-magicpath-path="ProfileDiscoveryPage.tsx" />
                <span data-magicpath-id="33" data-magicpath-path="ProfileDiscoveryPage.tsx">Clear all filters</span>
              </button>}
          </div>

          {/* Filters */}
          <AnimatePresence data-magicpath-id="34" data-magicpath-path="ProfileDiscoveryPage.tsx">
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
          }} className="space-y-6 pb-6" data-magicpath-id="35" data-magicpath-path="ProfileDiscoveryPage.tsx">
                {/* Role Filter */}
                <div data-magicpath-id="36" data-magicpath-path="ProfileDiscoveryPage.tsx">
                  <h3 className="text-lg font-semibold mb-3" data-magicpath-id="37" data-magicpath-path="ProfileDiscoveryPage.tsx">Role</h3>
                  <div className="flex flex-wrap gap-2" data-magicpath-id="38" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    {roleOptions.map(role => <button key={role} onClick={() => toggleFilter(selectedRoles, setSelectedRoles, role)} className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedRoles.includes(role) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`} data-magicpath-uuid={(role as any)["mpid"] ?? "unsafe"} data-magicpath-id="39" data-magicpath-path="ProfileDiscoveryPage.tsx">
                        {role}
                      </button>)}
                  </div>
                </div>

                {/* Interests Filter */}
                <div data-magicpath-id="40" data-magicpath-path="ProfileDiscoveryPage.tsx">
                  <h3 className="text-lg font-semibold mb-3" data-magicpath-id="41" data-magicpath-path="ProfileDiscoveryPage.tsx">Interests</h3>
                  <div className="flex flex-wrap gap-2" data-magicpath-id="42" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    {interestOptions.map(interest => <button key={interest} onClick={() => toggleFilter(selectedInterests, setSelectedInterests, interest)} className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedInterests.includes(interest) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`} data-magicpath-uuid={(interest as any)["mpid"] ?? "unsafe"} data-magicpath-id="43" data-magicpath-path="ProfileDiscoveryPage.tsx">
                        {interest}
                      </button>)}
                  </div>
                </div>

                {/* Building Status Filter */}
                <div data-magicpath-id="44" data-magicpath-path="ProfileDiscoveryPage.tsx">
                  <h3 className="text-lg font-semibold mb-3" data-magicpath-id="45" data-magicpath-path="ProfileDiscoveryPage.tsx">Building Status</h3>
                  <div className="flex flex-wrap gap-2" data-magicpath-id="46" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    {buildingStatusOptions.map(status => <button key={status} onClick={() => toggleFilter(selectedBuildingStatus, setSelectedBuildingStatus, status)} className={`px-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${selectedBuildingStatus.includes(status) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`} data-magicpath-uuid={(status as any)["mpid"] ?? "unsafe"} data-magicpath-id="47" data-magicpath-path="ProfileDiscoveryPage.tsx">
                        {status}
                      </button>)}
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="48" data-magicpath-path="ProfileDiscoveryPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="49" data-magicpath-path="ProfileDiscoveryPage.tsx">
          <div className="flex items-center justify-between mb-8" data-magicpath-id="50" data-magicpath-path="ProfileDiscoveryPage.tsx">
            <h3 className="text-2xl font-semibold" data-magicpath-id="51" data-magicpath-path="ProfileDiscoveryPage.tsx">
              {filteredProfiles.length} {filteredProfiles.length === 1 ? 'Profile' : 'Profiles'} Found
            </h3>
          </div>

          {/* Loading State */}
          {isLoading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="52" data-magicpath-path="ProfileDiscoveryPage.tsx">
              {Array.from({
            length: 8
          }).map((_, index) => <SkeletonCard key={index} data-magicpath-id="53" data-magicpath-path="ProfileDiscoveryPage.tsx" />)}
            </div>}

          {/* Empty State */}
          {!isLoading && filteredProfiles.length === 0 && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center py-16" data-magicpath-id="54" data-magicpath-path="ProfileDiscoveryPage.tsx">
              <User size={64} className="mx-auto mb-6 text-gray-400" data-magicpath-id="55" data-magicpath-path="ProfileDiscoveryPage.tsx" />
              <h3 className="text-2xl font-semibold mb-4" data-magicpath-id="56" data-magicpath-path="ProfileDiscoveryPage.tsx">No profiles found</h3>
              <p className="text-lg text-gray-600 mb-6" data-magicpath-id="57" data-magicpath-path="ProfileDiscoveryPage.tsx">
                Try adjusting your search criteria or clearing some filters.
              </p>
              {hasActiveFilters && <button onClick={clearAllFilters} className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-all duration-200" data-magicpath-id="58" data-magicpath-path="ProfileDiscoveryPage.tsx">
                  Clear All Filters
                </button>}
            </motion.div>}

          {/* Profile Grid */}
          {!isLoading && filteredProfiles.length > 0 && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5
        }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="59" data-magicpath-path="ProfileDiscoveryPage.tsx">
              {filteredProfiles.map((profile, index) => <motion.div key={profile.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className="bg-white border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 group" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="60" data-magicpath-path="ProfileDiscoveryPage.tsx">
                  {/* Profile Header */}
                  <div className="flex items-center justify-between mb-4" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="61" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    <div className="flex items-center space-x-4" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="62" data-magicpath-path="ProfileDiscoveryPage.tsx">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="63" data-magicpath-path="ProfileDiscoveryPage.tsx">
                        <User size={24} className="text-gray-400" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="64" data-magicpath-path="ProfileDiscoveryPage.tsx" />
                      </div>
                      <div data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="65" data-magicpath-path="ProfileDiscoveryPage.tsx">
                        <h4 className="text-xl font-bold" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="66" data-magicpath-path="ProfileDiscoveryPage.tsx">{profile.name}</h4>
                        <p className="text-gray-600 flex items-center space-x-1" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="ProfileDiscoveryPage.tsx">
                          <Briefcase size={14} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="68" data-magicpath-path="ProfileDiscoveryPage.tsx" />
                          <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="role:unknown" data-magicpath-id="69" data-magicpath-path="ProfileDiscoveryPage.tsx">{profile.role}</span>
                        </p>
                      </div>
                    </div>
                    <button onClick={() => toggleBookmark(profile.id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="70" data-magicpath-path="ProfileDiscoveryPage.tsx">
                      <Star size={20} className={profile.isBookmarked ? 'fill-black text-black' : 'text-gray-400'} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="71" data-magicpath-path="ProfileDiscoveryPage.tsx" />
                    </button>
                  </div>

                  {/* Company and Location */}
                  <div className="mb-4 space-y-1" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="72" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    <p className="flex items-center space-x-1 text-gray-600" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="73" data-magicpath-path="ProfileDiscoveryPage.tsx">
                      <Building size={14} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="74" data-magicpath-path="ProfileDiscoveryPage.tsx" />
                      <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="company:unknown" data-magicpath-id="75" data-magicpath-path="ProfileDiscoveryPage.tsx">{profile.company}</span>
                    </p>
                    {profile.location && <p className="flex items-center space-x-1 text-gray-600" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="76" data-magicpath-path="ProfileDiscoveryPage.tsx">
                        <MapPin size={14} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="77" data-magicpath-path="ProfileDiscoveryPage.tsx" />
                        <span data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="location:unknown" data-magicpath-id="78" data-magicpath-path="ProfileDiscoveryPage.tsx">{profile.location}</span>
                      </p>}
                  </div>

                  {/* Current Project */}
                  <div className="mb-4" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="79" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    <p className="text-sm font-semibold text-gray-800 mb-2" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="80" data-magicpath-path="ProfileDiscoveryPage.tsx">Currently building:</p>
                    <p className="text-sm text-gray-600 leading-relaxed" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="currentProject:unknown" data-magicpath-id="81" data-magicpath-path="ProfileDiscoveryPage.tsx">
                      {profile.currentProject}
                    </p>
                  </div>

                  {/* Interest Tags */}
                  <div className="mb-6" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="82" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    <div className="flex flex-wrap gap-2" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="83" data-magicpath-path="ProfileDiscoveryPage.tsx">
                      {profile.interests.map(interest => <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="84" data-magicpath-path="ProfileDiscoveryPage.tsx">
                          {interest}
                        </span>)}
                    </div>
                  </div>

                  {/* Building Status */}
                  <div className="mb-6" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="85" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    <span className={`px-3 py-1 text-xs font-semibold border ${profile.buildingStatus === 'Actively building' ? 'bg-green-50 text-green-700 border-green-200' : profile.buildingStatus === 'Exploring ideas' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`} data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-field="buildingStatus:unknown" data-magicpath-id="86" data-magicpath-path="ProfileDiscoveryPage.tsx">
                      {profile.buildingStatus}
                    </span>
                  </div>

                  {/* View Profile Button */}
                  <button className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-900 transition-all duration-200 group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20" data-magicpath-uuid={(profile as any)["mpid"] ?? "unsafe"} data-magicpath-id="87" data-magicpath-path="ProfileDiscoveryPage.tsx">
                    View Profile
                  </button>
                </motion.div>)}
            </motion.div>}

          {/* Load More Button */}
          {!isLoading && filteredProfiles.length > 0 && filteredProfiles.length >= 8 && <div className="text-center mt-12" data-magicpath-id="88" data-magicpath-path="ProfileDiscoveryPage.tsx">
              <button onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1500);
          }} className="bg-white text-black border-2 border-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20" data-magicpath-id="89" data-magicpath-path="ProfileDiscoveryPage.tsx">
                Load More Profiles
              </button>
            </div>}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="90" data-magicpath-path="ProfileDiscoveryPage.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="91" data-magicpath-path="ProfileDiscoveryPage.tsx">
          <p className="text-lg font-light" data-magicpath-id="92" data-magicpath-path="ProfileDiscoveryPage.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default ProfileDiscoveryPage;