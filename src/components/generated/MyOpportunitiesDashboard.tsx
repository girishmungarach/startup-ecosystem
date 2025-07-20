"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Edit, MoreHorizontal, Users, TrendingUp, CheckCircle, Clock, AlertCircle, X, BarChart3 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'closed'>('active');
  const [showCloseModal, setShowCloseModal] = useState<string | null>(null);

  // Mock data for user's opportunities
  const mockOpportunities: Opportunity[] = [{
    id: '1',
    title: 'Senior Full Stack Developer',
    type: 'Jobs',
    company: 'TechFlow Innovations',
    postedAt: '2 days ago',
    status: 'active',
    grabCount: 3,
    viewCount: 45,
    description: 'Join our dynamic team building next-generation fintech solutions.',
    hasNotifications: true
  }, {
    id: '2',
    title: 'Seed Funding Round - $2M',
    type: 'Investment',
    company: 'GreenTech Solutions',
    postedAt: '1 day ago',
    status: 'active',
    grabCount: 7,
    viewCount: 89,
    description: 'Seeking strategic investors for our sustainable energy platform.'
  }, {
    id: '3',
    title: 'Co-founder & CTO Needed',
    type: 'Co-founder',
    company: 'HealthAI Startup',
    postedAt: '3 days ago',
    status: 'active',
    grabCount: 0,
    viewCount: 23,
    description: 'Looking for a technical co-founder to join our healthcare AI venture.'
  }, {
    id: '4',
    title: 'Product Design Mentorship',
    type: 'Mentorship',
    company: 'Design Collective',
    postedAt: '1 week ago',
    status: 'draft',
    grabCount: 0,
    viewCount: 0,
    description: 'Experienced product designer offering mentorship for early-stage startups.'
  }, {
    id: '5',
    title: 'Frontend Developer - React/Next.js',
    type: 'Jobs',
    company: 'StartupLab',
    postedAt: '2 weeks ago',
    status: 'closed',
    grabCount: 12,
    viewCount: 156,
    description: 'Join our fast-growing SaaS startup.'
  }, {
    id: '6',
    title: 'Series A Funding - $10M',
    type: 'Investment',
    company: 'LogiTech Solutions',
    postedAt: '3 weeks ago',
    status: 'closed',
    grabCount: 8,
    viewCount: 134,
    description: 'Established logistics startup seeking Series A funding.'
  }, {
    id: '7',
    title: 'Marketing Co-founder',
    type: 'Co-founder',
    company: 'FoodTech Venture',
    postedAt: '1 month ago',
    status: 'closed',
    grabCount: 5,
    viewCount: 78,
    description: 'Food delivery startup seeking marketing co-founder.'
  }, {
    id: '8',
    title: 'Tech Startup Networking Event',
    type: 'Events',
    company: 'Startup Community',
    postedAt: '1 month ago',
    status: 'closed',
    grabCount: 25,
    viewCount: 234,
    description: 'Monthly networking event for tech entrepreneurs.'
  }, {
    id: '9',
    title: 'Strategic Partnership - EdTech',
    type: 'Partnerships',
    company: 'EduNext Platform',
    postedAt: '1 month ago',
    status: 'closed',
    grabCount: 4,
    viewCount: 67,
    description: 'Seeking content partners for our online learning platform.'
  }];

  // Statistics calculation
  const stats: StatsCard[] = useMemo(() => {
    const totalPosts = mockOpportunities.length;
    const totalGrabs = mockOpportunities.reduce((sum, opp) => sum + opp.grabCount, 0);
    const successfulConnections = mockOpportunities.filter(opp => opp.grabCount > 0).length;
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
  }, [mockOpportunities]);

  // Filter opportunities by tab
  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter(opp => opp.status === activeTab);
  }, [activeTab, mockOpportunities]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      active: mockOpportunities.filter(opp => opp.status === 'active').length,
      draft: mockOpportunities.filter(opp => opp.status === 'draft').length,
      closed: mockOpportunities.filter(opp => opp.status === 'closed').length
    };
  }, [mockOpportunities]);
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
    console.log('View grabs for opportunity:', opportunityId);
  };
  const handleEdit = (opportunityId: string) => {
    console.log('Edit opportunity:', opportunityId);
  };
  const handleCloseOpportunity = (opportunityId: string) => {
    console.log('Close opportunity:', opportunityId);
    setShowCloseModal(null);
  };
  const handleReopenOpportunity = (opportunityId: string) => {
    console.log('Reopen opportunity:', opportunityId);
  };
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8">
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              Opportunities
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              Browse Profiles
            </a>
            <a href="#" className="text-lg font-semibold text-black border-b-2 border-black pb-1">
              My Opportunities
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              Bookmarks
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              My Opportunities
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl">
              Manage your posted opportunities, track engagement, and connect with interested candidates.
            </p>
          </motion.div>

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
        }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2">
              {[{
              key: 'active',
              label: `Active (${tabCounts.active})`
            }, {
              key: 'draft',
              label: `Draft (${tabCounts.draft})`
            }, {
              key: 'closed',
              label: `Closed (${tabCounts.closed})`
            }].map(tab => <button key={tab.key} onClick={() => setActiveTab(tab.key as 'active' | 'draft' | 'closed')} className={`px-6 py-3 text-base font-medium transition-all duration-200 border-2 ${activeTab === tab.key ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                  {tab.label}
                </button>)}
            </div>

            {/* Post New Opportunity Button */}
            <button className="bg-black text-white px-6 py-3 text-base font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2">
              <Plus size={20} />
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
                {activeTab !== 'closed' && <button className="bg-black text-white px-6 py-3 text-base font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2 mx-auto">
                    <Plus size={20} />
                    <span>Post New Opportunity</span>
                  </button>}
              </motion.div>}
          </AnimatePresence>
        </div>
      </main>

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
export default MyOpportunitiesDashboard;