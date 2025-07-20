"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Clock, Bookmark, Filter } from 'lucide-react';
interface Opportunity {
  id: string;
  title: string;
  type: 'Jobs' | 'Investment' | 'Co-founder' | 'Mentorship' | 'Events' | 'Partnerships';
  company: string;
  location: string;
  description: string;
  postedAt: string;
  isBookmarked?: boolean;
  mpid?: string;
}
const OpportunitiesDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockOpportunities: Opportunity[] = [{
    id: '1',
    title: 'Senior Full Stack Developer',
    type: 'Jobs',
    company: 'TechFlow Innovations',
    location: 'Bangalore, India',
    description: 'Join our dynamic team building next-generation fintech solutions. We\'re looking for experienced developers passionate about creating scalable applications.',
    postedAt: '2 days ago',
    isBookmarked: false,
    mpid: "6bc15f36-3cda-4d68-a9d5-262af5273623"
  }, {
    id: '2',
    title: 'Seed Funding Round - $2M',
    type: 'Investment',
    company: 'GreenTech Solutions',
    location: 'Mumbai, India',
    description: 'Seeking strategic investors for our sustainable energy platform. We\'ve achieved product-market fit and are ready to scale across India.',
    postedAt: '1 day ago',
    isBookmarked: true,
    mpid: "51b0abe8-df1d-4196-989d-de9721bce47f"
  }, {
    id: '3',
    title: 'Co-founder & CTO Needed',
    type: 'Co-founder',
    company: 'HealthAI Startup',
    location: 'Delhi, India',
    description: 'Looking for a technical co-founder to join our healthcare AI venture. Equity-based partnership with proven business model.',
    postedAt: '3 days ago',
    isBookmarked: false,
    mpid: "b817b9a4-8d63-4b03-b5e4-2c20f83f6ab9"
  }, {
    id: '4',
    title: 'Product Design Mentorship',
    type: 'Mentorship',
    company: 'Design Collective',
    location: 'Remote',
    description: 'Experienced product designer offering mentorship for early-stage startups. Focus on user experience and design systems.',
    postedAt: '1 week ago',
    isBookmarked: false,
    mpid: "8ea6961e-b0ee-4427-b099-b32d6d18977f"
  }, {
    id: '5',
    title: 'Startup Pitch Competition',
    type: 'Events',
    company: 'Innovation Hub',
    location: 'Hyderabad, India',
    description: 'Annual startup pitch competition with $500K in prizes. Applications open for early-stage startups across all sectors.',
    postedAt: '5 days ago',
    isBookmarked: true,
    mpid: "a8c3cf7b-2480-4014-9b91-c572daf542db"
  }, {
    id: '6',
    title: 'Strategic Partnership - EdTech',
    type: 'Partnerships',
    company: 'EduNext Platform',
    location: 'Pune, India',
    description: 'Seeking content partners for our online learning platform. Revenue sharing model with established user base of 100K+ students.',
    postedAt: '4 days ago',
    isBookmarked: false,
    mpid: "95b91185-0467-4843-b923-9e8280d2103b"
  }, {
    id: '7',
    title: 'Frontend Developer - React/Next.js',
    type: 'Jobs',
    company: 'StartupLab',
    location: 'Chennai, India',
    description: 'Join our fast-growing SaaS startup. Work on cutting-edge web applications with modern tech stack and flexible work culture.',
    postedAt: '6 days ago',
    isBookmarked: false,
    mpid: "f045b604-0b0b-4860-854d-5e9e2911f824"
  }, {
    id: '8',
    title: 'Series A Funding - $10M',
    type: 'Investment',
    company: 'LogiTech Solutions',
    location: 'Gurgaon, India',
    description: 'Established logistics startup seeking Series A funding. Strong revenue growth and expanding market presence.',
    postedAt: '1 week ago',
    isBookmarked: false,
    mpid: "f12103ef-91cd-433d-b059-c867c25a6a01"
  }, {
    id: '9',
    title: 'Marketing Co-founder',
    type: 'Co-founder',
    company: 'FoodTech Venture',
    location: 'Mumbai, India',
    description: 'Food delivery startup seeking marketing co-founder. Proven traction in local market, ready for city-wide expansion.',
    postedAt: '2 weeks ago',
    isBookmarked: true,
    mpid: "55b2e755-28fa-48c1-8bf3-5b3d2c38aa31"
  }, {
    id: '10',
    title: 'Tech Startup Networking Event',
    type: 'Events',
    company: 'Startup Community',
    location: 'Bangalore, India',
    description: 'Monthly networking event for tech entrepreneurs, investors, and professionals. Great opportunity to connect and collaborate.',
    postedAt: '3 days ago',
    isBookmarked: false,
    mpid: "14992beb-af70-43a2-afca-bb55eda52d7f"
  }];
  const filterOptions = ['All', 'Jobs', 'Investment', 'Co-founder', 'Mentorship', 'Events', 'Partnerships'];
  const filteredOpportunities = useMemo(() => {
    let filtered = mockOpportunities;
    if (activeFilter !== 'All') {
      filtered = filtered.filter(opp => opp.type === activeFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opp => opp.title.toLowerCase().includes(query) || opp.company.toLowerCase().includes(query) || opp.description.toLowerCase().includes(query) || opp.location.toLowerCase().includes(query));
    }
    return filtered;
  }, [activeFilter, searchQuery]);
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
  const handleGrabIt = (opportunity: Opportunity) => {
    // Handle "Grab It" action
    console.log('Grab It clicked for:', opportunity.title);
  };
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="0" data-magicpath-path="OpportunitiesDashboard.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="1" data-magicpath-path="OpportunitiesDashboard.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="OpportunitiesDashboard.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="3" data-magicpath-path="OpportunitiesDashboard.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="4" data-magicpath-path="OpportunitiesDashboard.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8" data-magicpath-id="5" data-magicpath-path="OpportunitiesDashboard.tsx">
            <a href="#" className="text-lg font-semibold text-black border-b-2 border-black pb-1">
              Opportunities
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              Browse Profiles
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              My Opportunities
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              Bookmarks
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="6" data-magicpath-path="OpportunitiesDashboard.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="7" data-magicpath-path="OpportunitiesDashboard.tsx">
          {/* Page Title */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="mb-8" data-magicpath-id="8" data-magicpath-path="OpportunitiesDashboard.tsx">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-magicpath-id="9" data-magicpath-path="OpportunitiesDashboard.tsx">
              Latest Opportunities
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl" data-magicpath-id="10" data-magicpath-path="OpportunitiesDashboard.tsx">
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
        }} className="mb-8 space-y-6" data-magicpath-id="11" data-magicpath-path="OpportunitiesDashboard.tsx">
            {/* Search Bar */}
            <div className="relative max-w-2xl" data-magicpath-id="12" data-magicpath-path="OpportunitiesDashboard.tsx">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} data-magicpath-id="13" data-magicpath-path="OpportunitiesDashboard.tsx" />
              <input type="text" placeholder="Search opportunities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" data-magicpath-id="14" data-magicpath-path="OpportunitiesDashboard.tsx" />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2" data-magicpath-id="15" data-magicpath-path="OpportunitiesDashboard.tsx">
              {filterOptions.map(filter => <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-3 text-base font-medium transition-all duration-200 border-2 ${activeFilter === filter ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'}`} data-magicpath-uuid={(filter as any)["mpid"] ?? "unsafe"} data-magicpath-id="16" data-magicpath-path="OpportunitiesDashboard.tsx">
                  {filter}
                </button>)}
            </div>
          </motion.div>

          {/* Opportunities Grid */}
          <AnimatePresence mode="wait" data-magicpath-id="17" data-magicpath-path="OpportunitiesDashboard.tsx">
            {isLoading ?
          // Loading Skeleton
          <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-magicpath-id="18" data-magicpath-path="OpportunitiesDashboard.tsx">
                {[...Array(6)].map((_, index) => <div key={index} className="border-2 border-gray-200 p-6 animate-pulse" data-magicpath-id="19" data-magicpath-path="OpportunitiesDashboard.tsx">
                    <div className="h-4 bg-gray-200 rounded mb-4" data-magicpath-id="20" data-magicpath-path="OpportunitiesDashboard.tsx"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2" data-magicpath-id="21" data-magicpath-path="OpportunitiesDashboard.tsx"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4" data-magicpath-id="22" data-magicpath-path="OpportunitiesDashboard.tsx"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4" data-magicpath-id="23" data-magicpath-path="OpportunitiesDashboard.tsx"></div>
                    <div className="h-8 bg-gray-200 rounded" data-magicpath-id="24" data-magicpath-path="OpportunitiesDashboard.tsx"></div>
                  </div>)}
              </motion.div> : filteredOpportunities.length > 0 ? <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-magicpath-id="25" data-magicpath-path="OpportunitiesDashboard.tsx">
                {filteredOpportunities.map((opportunity, index) => <motion.div key={opportunity.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: index * 0.1
            }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 hover:shadow-lg group" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="OpportunitiesDashboard.tsx">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="OpportunitiesDashboard.tsx">
                      <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(opportunity.type)}`} data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-field="type:unknown" data-magicpath-id="28" data-magicpath-path="OpportunitiesDashboard.tsx">
                        {opportunity.type}
                      </span>
                      <button onClick={() => handleBookmark(opportunity.id)} className="text-gray-400 hover:text-black transition-colors duration-200" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="OpportunitiesDashboard.tsx">
                        <Bookmark size={20} className={opportunity.isBookmarked ? 'fill-current text-black' : ''} data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="OpportunitiesDashboard.tsx" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors duration-200" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="31" data-magicpath-path="OpportunitiesDashboard.tsx">
                      {opportunity.title}
                    </h3>

                    {/* Company and Location */}
                    <div className="space-y-2 mb-4" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="OpportunitiesDashboard.tsx">
                      <p className="text-base font-semibold text-gray-800" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-field="company:unknown" data-magicpath-id="33" data-magicpath-path="OpportunitiesDashboard.tsx">
                        {opportunity.company}
                      </p>
                      <div className="flex items-center text-gray-600" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="OpportunitiesDashboard.tsx">
                        <MapPin size={16} className="mr-2" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="35" data-magicpath-path="OpportunitiesDashboard.tsx" />
                        <span className="text-sm" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-field="location:unknown" data-magicpath-id="36" data-magicpath-path="OpportunitiesDashboard.tsx">{opportunity.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="37" data-magicpath-path="OpportunitiesDashboard.tsx">
                      {opportunity.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="OpportunitiesDashboard.tsx">
                      <div className="flex items-center text-gray-500" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="39" data-magicpath-path="OpportunitiesDashboard.tsx">
                        <Clock size={14} className="mr-1" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="40" data-magicpath-path="OpportunitiesDashboard.tsx" />
                        <span className="text-xs" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-field="postedAt:unknown" data-magicpath-id="41" data-magicpath-path="OpportunitiesDashboard.tsx">Posted {opportunity.postedAt}</span>
                      </div>
                      <button onClick={() => handleGrabIt(opportunity)} className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="42" data-magicpath-path="OpportunitiesDashboard.tsx">
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
          }} className="text-center py-16" data-magicpath-id="43" data-magicpath-path="OpportunitiesDashboard.tsx">
                <Filter size={64} className="mx-auto text-gray-300 mb-6" data-magicpath-id="44" data-magicpath-path="OpportunitiesDashboard.tsx" />
                <h3 className="text-2xl font-bold mb-4" data-magicpath-id="45" data-magicpath-path="OpportunitiesDashboard.tsx">No opportunities found</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto" data-magicpath-id="46" data-magicpath-path="OpportunitiesDashboard.tsx">
                  Try adjusting your search or filters to find more opportunities.
                </p>
              </motion.div>}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action Button */}
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
    }} data-magicpath-id="47" data-magicpath-path="OpportunitiesDashboard.tsx">
        <Plus size={24} data-magicpath-id="48" data-magicpath-path="OpportunitiesDashboard.tsx" />
        <span className="sr-only" data-magicpath-id="49" data-magicpath-path="OpportunitiesDashboard.tsx">Post New Opportunity</span>
      </motion.button>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="50" data-magicpath-path="OpportunitiesDashboard.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="51" data-magicpath-path="OpportunitiesDashboard.tsx">
          <p className="text-lg font-light" data-magicpath-id="52" data-magicpath-path="OpportunitiesDashboard.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default OpportunitiesDashboard;