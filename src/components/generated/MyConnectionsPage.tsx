"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, User, Building, Calendar, Eye, UserX, Check, X, Clock, AlertCircle, Users, CheckCircle, XCircle, RotateCcw, Send, FileText } from 'lucide-react';
interface Connection {
  id: string;
  name: string;
  role: string;
  company: string;
  profileImage?: string;
  opportunityTitle: string;
  connectionDate: string;
  status: 'active' | 'pending' | 'declined';
  requestType?: 'direct' | 'questionnaire';
  waitingDays?: number;
  declineReason?: string;
}
interface ConnectionStats {
  active: number;
  pending: number;
  declined: number;
}
const MyConnectionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'declined'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  // Mock data for connections
  const mockConnections: Connection[] = [
  // Active Connections
  {
    id: '1',
    name: 'Alex Rodriguez',
    role: 'Senior Developer',
    company: 'TechFlow Solutions',
    opportunityTitle: 'Senior Full Stack Developer',
    connectionDate: '2024-01-15',
    status: 'active'
  }, {
    id: '2',
    name: 'Sarah Kim',
    role: 'Product Manager',
    company: 'InnovateCorp',
    opportunityTitle: 'Product Manager - FinTech',
    connectionDate: '2024-01-10',
    status: 'active'
  }, {
    id: '3',
    name: 'Michael Chen',
    role: 'Investor',
    company: 'Venture Capital Partners',
    opportunityTitle: 'Seed Funding Round - $2M',
    connectionDate: '2024-01-08',
    status: 'active'
  }, {
    id: '4',
    name: 'Emily Johnson',
    role: 'UX Designer',
    company: 'Design Studio Pro',
    opportunityTitle: 'Senior UX Designer',
    connectionDate: '2024-01-05',
    status: 'active'
  }, {
    id: '5',
    name: 'David Park',
    role: 'Co-founder',
    company: 'StartupLab',
    opportunityTitle: 'Technical Co-founder Needed',
    connectionDate: '2024-01-03',
    status: 'active'
  }, {
    id: '6',
    name: 'Lisa Wang',
    role: 'Marketing Director',
    company: 'GrowthHackers Inc',
    opportunityTitle: 'Marketing Partnership',
    connectionDate: '2023-12-28',
    status: 'active'
  }, {
    id: '7',
    name: 'James Wilson',
    role: 'CTO',
    company: 'AI Innovations',
    opportunityTitle: 'AI/ML Engineer Position',
    connectionDate: '2023-12-25',
    status: 'active'
  }, {
    id: '8',
    name: 'Anna Martinez',
    role: 'Business Analyst',
    company: 'DataCorp Solutions',
    opportunityTitle: 'Business Intelligence Role',
    connectionDate: '2023-12-20',
    status: 'active'
  },
  // Pending Decisions
  {
    id: '9',
    name: 'Robert Taylor',
    role: 'Software Engineer',
    company: 'CodeCraft Studios',
    opportunityTitle: 'Frontend Developer Position',
    connectionDate: '2024-01-18',
    status: 'pending',
    requestType: 'questionnaire',
    waitingDays: 2
  }, {
    id: '10',
    name: 'Jennifer Lee',
    role: 'Data Scientist',
    company: 'Analytics Pro',
    opportunityTitle: 'Data Science Collaboration',
    connectionDate: '2024-01-16',
    status: 'pending',
    requestType: 'direct',
    waitingDays: 4
  }, {
    id: '11',
    name: 'Kevin Brown',
    role: 'DevOps Engineer',
    company: 'CloudTech Systems',
    opportunityTitle: 'DevOps Infrastructure Role',
    connectionDate: '2024-01-14',
    status: 'pending',
    requestType: 'questionnaire',
    waitingDays: 6
  },
  // Declined Requests
  {
    id: '12',
    name: 'Michelle Davis',
    role: 'Sales Manager',
    company: 'SalesForce Pro',
    opportunityTitle: 'Sales Partnership Opportunity',
    connectionDate: '2024-01-12',
    status: 'declined',
    declineReason: 'Not aligned with current goals'
  }, {
    id: '13',
    name: 'Thomas Anderson',
    role: 'Consultant',
    company: 'Strategy Consulting',
    opportunityTitle: 'Business Strategy Consultation',
    connectionDate: '2024-01-09',
    status: 'declined',
    declineReason: 'Timeline conflict'
  }, {
    id: '14',
    name: 'Rachel Green',
    role: 'HR Director',
    company: 'TalentAcquisition Co',
    opportunityTitle: 'HR Partnership',
    connectionDate: '2024-01-07',
    status: 'declined',
    declineReason: 'Different target market'
  }, {
    id: '15',
    name: 'Mark Thompson',
    role: 'Operations Manager',
    company: 'LogiFlow Systems',
    opportunityTitle: 'Operations Optimization',
    connectionDate: '2024-01-04',
    status: 'declined',
    declineReason: 'Resource constraints'
  }, {
    id: '16',
    name: 'Sophie Miller',
    role: 'Finance Director',
    company: 'FinanceFirst',
    opportunityTitle: 'Financial Advisory Role',
    connectionDate: '2024-01-01',
    status: 'declined',
    declineReason: 'Expertise mismatch'
  }];

  // Calculate stats
  const stats: ConnectionStats = useMemo(() => {
    return {
      active: mockConnections.filter(c => c.status === 'active').length,
      pending: mockConnections.filter(c => c.status === 'pending').length,
      declined: mockConnections.filter(c => c.status === 'declined').length
    };
  }, [mockConnections]);

  // Filter connections based on active tab and search
  const filteredConnections = useMemo(() => {
    let filtered = mockConnections.filter(connection => connection.status === activeTab);
    if (searchQuery) {
      filtered = filtered.filter(connection => connection.name.toLowerCase().includes(searchQuery.toLowerCase()) || connection.company.toLowerCase().includes(searchQuery.toLowerCase()) || connection.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [activeTab, searchQuery, mockConnections]);

  // Handle actions
  const handleRevokeAccess = (connectionId: string) => {
    console.log('Revoke access for:', connectionId);
    setShowRevokeModal(null);
  };
  const handleShareContact = (connectionId: string) => {
    console.log('Share contact for:', connectionId);
  };
  const handleSendQuestionnaire = (connectionId: string) => {
    console.log('Send questionnaire to:', connectionId);
  };
  const handleDeclineRequest = (connectionId: string) => {
    console.log('Decline request for:', connectionId);
    setShowDeclineModal(null);
  };
  const handleReconsider = (connectionId: string) => {
    console.log('Reconsider connection:', connectionId);
  };
  const handleViewProfile = (connectionId: string) => {
    console.log('View profile for:', connectionId);
  };
  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for connections:', selectedConnections);
    setSelectedConnections([]);
  };
  const toggleConnectionSelection = (connectionId: string) => {
    setSelectedConnections(prev => prev.includes(connectionId) ? prev.filter(id => id !== connectionId) : [...prev, connectionId]);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const getPriorityLevel = (waitingDays?: number) => {
    if (!waitingDays) return 'normal';
    if (waitingDays >= 7) return 'high';
    if (waitingDays >= 3) return 'medium';
    return 'normal';
  };
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="0" data-magicpath-path="MyConnectionsPage.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="1" data-magicpath-path="MyConnectionsPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="MyConnectionsPage.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="3" data-magicpath-path="MyConnectionsPage.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="4" data-magicpath-path="MyConnectionsPage.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8" data-magicpath-id="5" data-magicpath-path="MyConnectionsPage.tsx">
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              Opportunities
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              Browse Profiles
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              My Opportunities
            </a>
            <a href="#" className="text-lg font-semibold text-black border-b-2 border-black pb-1">
              My Connections
            </a>
            <a href="#" className="text-lg font-light text-gray-600 hover:text-black transition-colors duration-200">
              My Profile
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="6" data-magicpath-path="MyConnectionsPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="7" data-magicpath-path="MyConnectionsPage.tsx">
          {/* Page Title */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="mb-8" data-magicpath-id="8" data-magicpath-path="MyConnectionsPage.tsx">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-magicpath-id="9" data-magicpath-path="MyConnectionsPage.tsx">
              My Connections
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl" data-magicpath-id="10" data-magicpath-path="MyConnectionsPage.tsx">
              Manage your professional connections, track contact access, and review connection history.
            </p>
          </motion.div>

          {/* Stats Summary */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="mb-8" data-magicpath-id="11" data-magicpath-path="MyConnectionsPage.tsx">
            <div className="bg-gray-50 p-6 border-l-4 border-black" data-magicpath-id="12" data-magicpath-path="MyConnectionsPage.tsx">
              <p className="text-lg font-medium" data-magicpath-id="13" data-magicpath-path="MyConnectionsPage.tsx">
                <span className="font-bold" data-magicpath-id="14" data-magicpath-path="MyConnectionsPage.tsx">{stats.active}</span> Active Connections, 
                <span className="font-bold text-orange-600 ml-2" data-magicpath-id="15" data-magicpath-path="MyConnectionsPage.tsx">{stats.pending}</span> Pending, 
                <span className="font-bold text-gray-600 ml-2" data-magicpath-id="16" data-magicpath-path="MyConnectionsPage.tsx">{stats.declined}</span> Declined
              </p>
            </div>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="mb-8" data-magicpath-id="17" data-magicpath-path="MyConnectionsPage.tsx">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between" data-magicpath-id="18" data-magicpath-path="MyConnectionsPage.tsx">
              <div className="relative flex-1 max-w-md" data-magicpath-id="19" data-magicpath-path="MyConnectionsPage.tsx">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" data-magicpath-id="20" data-magicpath-path="MyConnectionsPage.tsx" />
                <input type="text" placeholder="Search connections..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition-colors" data-magicpath-id="21" data-magicpath-path="MyConnectionsPage.tsx" />
              </div>
              
              {selectedConnections.length > 0 && <div className="flex items-center space-x-2" data-magicpath-id="22" data-magicpath-path="MyConnectionsPage.tsx">
                  <span className="text-sm text-gray-600" data-magicpath-id="23" data-magicpath-path="MyConnectionsPage.tsx">
                    {selectedConnections.length} selected
                  </span>
                  <button onClick={() => handleBulkAction('revoke')} className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors" data-magicpath-id="24" data-magicpath-path="MyConnectionsPage.tsx">
                    Bulk Revoke
                  </button>
                </div>}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="mb-8" data-magicpath-id="25" data-magicpath-path="MyConnectionsPage.tsx">
            <div className="flex flex-wrap gap-2" data-magicpath-id="26" data-magicpath-path="MyConnectionsPage.tsx">
              {[{
              key: 'active',
              label: `Active (${stats.active})`,
              icon: <CheckCircle size={16} data-magicpath-id="27" data-magicpath-path="MyConnectionsPage.tsx" />
            }, {
              key: 'pending',
              label: `Pending (${stats.pending})`,
              icon: <Clock size={16} data-magicpath-id="28" data-magicpath-path="MyConnectionsPage.tsx" />
            }, {
              key: 'declined',
              label: `Declined (${stats.declined})`,
              icon: <XCircle size={16} data-magicpath-id="29" data-magicpath-path="MyConnectionsPage.tsx" />
            }].map(tab => <button key={tab.key} onClick={() => setActiveTab(tab.key as 'active' | 'pending' | 'declined')} className={`px-6 py-3 text-base font-medium transition-all duration-200 border-2 flex items-center space-x-2 ${activeTab === tab.key ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'}`} data-magicpath-id="30" data-magicpath-path="MyConnectionsPage.tsx">
                  {tab.icon}
                  <span data-magicpath-id="31" data-magicpath-path="MyConnectionsPage.tsx">{tab.label}</span>
                </button>)}
            </div>
          </motion.div>

          {/* Connections List */}
          <AnimatePresence mode="wait" data-magicpath-id="32" data-magicpath-path="MyConnectionsPage.tsx">
            {filteredConnections.length > 0 ? <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="space-y-4" data-magicpath-id="33" data-magicpath-path="MyConnectionsPage.tsx">
                {filteredConnections.map((connection, index) => <motion.div key={connection.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: index * 0.05
            }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 hover:shadow-lg" data-magicpath-id="34" data-magicpath-path="MyConnectionsPage.tsx">
                    <div className="flex items-start justify-between" data-magicpath-id="35" data-magicpath-path="MyConnectionsPage.tsx">
                      <div className="flex items-start space-x-4 flex-1" data-magicpath-id="36" data-magicpath-path="MyConnectionsPage.tsx">
                        {/* Selection Checkbox */}
                        {activeTab === 'active' && <input type="checkbox" checked={selectedConnections.includes(connection.id)} onChange={() => toggleConnectionSelection(connection.id)} className="mt-2 w-4 h-4 text-black border-2 border-gray-300 focus:ring-black focus:ring-2" data-magicpath-id="37" data-magicpath-path="MyConnectionsPage.tsx" />}

                        {/* Profile Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 flex-shrink-0" data-magicpath-id="38" data-magicpath-path="MyConnectionsPage.tsx">
                          <User size={24} className="text-gray-400" data-magicpath-id="39" data-magicpath-path="MyConnectionsPage.tsx" />
                        </div>

                        {/* Connection Info */}
                        <div className="flex-1 min-w-0" data-magicpath-id="40" data-magicpath-path="MyConnectionsPage.tsx">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3" data-magicpath-id="41" data-magicpath-path="MyConnectionsPage.tsx">
                            <div data-magicpath-id="42" data-magicpath-path="MyConnectionsPage.tsx">
                              <h3 className="text-xl font-bold mb-1" data-magicpath-id="43" data-magicpath-path="MyConnectionsPage.tsx">{connection.name}</h3>
                              <div className="flex items-center space-x-2 text-gray-600 mb-2" data-magicpath-id="44" data-magicpath-path="MyConnectionsPage.tsx">
                                <Building size={16} data-magicpath-id="45" data-magicpath-path="MyConnectionsPage.tsx" />
                                <span data-magicpath-id="46" data-magicpath-path="MyConnectionsPage.tsx">{connection.role} at {connection.company}</span>
                              </div>
                            </div>

                            {/* Priority Badge for Pending */}
                            {activeTab === 'pending' && connection.waitingDays && <div className={`px-3 py-1 text-sm font-medium border ${getPriorityLevel(connection.waitingDays) === 'high' ? 'bg-red-100 text-red-800 border-red-200' : getPriorityLevel(connection.waitingDays) === 'medium' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`} data-magicpath-id="47" data-magicpath-path="MyConnectionsPage.tsx">
                                {connection.waitingDays} days waiting
                              </div>}
                          </div>

                          {/* Opportunity Connection */}
                          <div className="mb-3" data-magicpath-id="48" data-magicpath-path="MyConnectionsPage.tsx">
                            <p className="text-sm text-gray-600 mb-1" data-magicpath-id="49" data-magicpath-path="MyConnectionsPage.tsx">Connected through:</p>
                            <p className="font-medium" data-magicpath-id="50" data-magicpath-path="MyConnectionsPage.tsx">{connection.opportunityTitle}</p>
                          </div>

                          {/* Connection Date */}
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4" data-magicpath-id="51" data-magicpath-path="MyConnectionsPage.tsx">
                            <Calendar size={14} data-magicpath-id="52" data-magicpath-path="MyConnectionsPage.tsx" />
                            <span data-magicpath-id="53" data-magicpath-path="MyConnectionsPage.tsx">
                              {activeTab === 'active' ? 'Contact shared' : activeTab === 'pending' ? 'Request received' : 'Declined'} on {formatDate(connection.connectionDate)}
                            </span>
                          </div>

                          {/* Request Type for Pending */}
                          {activeTab === 'pending' && connection.requestType && <div className="mb-4" data-magicpath-id="54" data-magicpath-path="MyConnectionsPage.tsx">
                              <div className="flex items-center space-x-2" data-magicpath-id="55" data-magicpath-path="MyConnectionsPage.tsx">
                                {connection.requestType === 'questionnaire' ? <FileText size={16} className="text-blue-600" data-magicpath-id="56" data-magicpath-path="MyConnectionsPage.tsx" /> : <Send size={16} className="text-green-600" data-magicpath-id="57" data-magicpath-path="MyConnectionsPage.tsx" />}
                                <span className="text-sm font-medium" data-magicpath-id="58" data-magicpath-path="MyConnectionsPage.tsx">
                                  {connection.requestType === 'questionnaire' ? 'Questionnaire response awaiting review' : 'Direct contact request'}
                                </span>
                              </div>
                            </div>}

                          {/* Decline Reason for Declined */}
                          {activeTab === 'declined' && connection.declineReason && <div className="mb-4" data-magicpath-id="59" data-magicpath-path="MyConnectionsPage.tsx">
                              <p className="text-sm text-gray-600 mb-1" data-magicpath-id="60" data-magicpath-path="MyConnectionsPage.tsx">Reason:</p>
                              <p className="text-sm italic text-gray-700" data-magicpath-id="61" data-magicpath-path="MyConnectionsPage.tsx">{connection.declineReason}</p>
                            </div>}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 ml-4" data-magicpath-id="62" data-magicpath-path="MyConnectionsPage.tsx">
                        <button onClick={() => handleViewProfile(connection.id)} className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium" data-magicpath-id="63" data-magicpath-path="MyConnectionsPage.tsx">
                          <Eye size={16} data-magicpath-id="64" data-magicpath-path="MyConnectionsPage.tsx" />
                          <span data-magicpath-id="65" data-magicpath-path="MyConnectionsPage.tsx">View Profile</span>
                        </button>

                        {activeTab === 'active' && <button onClick={() => setShowRevokeModal(connection.id)} className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium" data-magicpath-id="66" data-magicpath-path="MyConnectionsPage.tsx">
                            <UserX size={16} data-magicpath-id="67" data-magicpath-path="MyConnectionsPage.tsx" />
                            <span data-magicpath-id="68" data-magicpath-path="MyConnectionsPage.tsx">Revoke Access</span>
                          </button>}

                        {activeTab === 'pending' && <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2" data-magicpath-id="69" data-magicpath-path="MyConnectionsPage.tsx">
                            <button onClick={() => handleShareContact(connection.id)} className="bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1" data-magicpath-id="70" data-magicpath-path="MyConnectionsPage.tsx">
                              <Check size={16} data-magicpath-id="71" data-magicpath-path="MyConnectionsPage.tsx" />
                              <span data-magicpath-id="72" data-magicpath-path="MyConnectionsPage.tsx">Share Contact</span>
                            </button>
                            {connection.requestType === 'direct' && <button onClick={() => handleSendQuestionnaire(connection.id)} className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1" data-magicpath-id="73" data-magicpath-path="MyConnectionsPage.tsx">
                                <FileText size={16} data-magicpath-id="74" data-magicpath-path="MyConnectionsPage.tsx" />
                                <span data-magicpath-id="75" data-magicpath-path="MyConnectionsPage.tsx">Send Questionnaire</span>
                              </button>}
                            <button onClick={() => setShowDeclineModal(connection.id)} className="bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-1" data-magicpath-id="76" data-magicpath-path="MyConnectionsPage.tsx">
                              <X size={16} data-magicpath-id="77" data-magicpath-path="MyConnectionsPage.tsx" />
                              <span data-magicpath-id="78" data-magicpath-path="MyConnectionsPage.tsx">Decline</span>
                            </button>
                          </div>}

                        {activeTab === 'declined' && <button onClick={() => handleReconsider(connection.id)} className="text-green-600 hover:text-green-800 transition-colors duration-200 flex items-center space-x-1 text-sm font-medium" data-magicpath-id="79" data-magicpath-path="MyConnectionsPage.tsx">
                            <RotateCcw size={16} data-magicpath-id="80" data-magicpath-path="MyConnectionsPage.tsx" />
                            <span data-magicpath-id="81" data-magicpath-path="MyConnectionsPage.tsx">Reconsider</span>
                          </button>}
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
          }} className="text-center py-16" data-magicpath-id="82" data-magicpath-path="MyConnectionsPage.tsx">
                <div className="mb-6" data-magicpath-id="83" data-magicpath-path="MyConnectionsPage.tsx">
                  {activeTab === 'active' && <Users size={64} className="mx-auto text-gray-300" data-magicpath-id="84" data-magicpath-path="MyConnectionsPage.tsx" />}
                  {activeTab === 'pending' && <Clock size={64} className="mx-auto text-gray-300" data-magicpath-id="85" data-magicpath-path="MyConnectionsPage.tsx" />}
                  {activeTab === 'declined' && <XCircle size={64} className="mx-auto text-gray-300" data-magicpath-id="86" data-magicpath-path="MyConnectionsPage.tsx" />}
                </div>
                <h3 className="text-2xl font-bold mb-4" data-magicpath-id="87" data-magicpath-path="MyConnectionsPage.tsx">
                  No {activeTab} connections
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto" data-magicpath-id="88" data-magicpath-path="MyConnectionsPage.tsx">
                  {activeTab === 'active' && "You haven't shared your contact details with anyone yet."}
                  {activeTab === 'pending' && "No pending connection requests at the moment."}
                  {activeTab === 'declined' && "No declined connection requests in your history."}
                </p>
              </motion.div>}
          </AnimatePresence>
        </div>
      </main>

      {/* Revoke Access Modal */}
      <AnimatePresence data-magicpath-id="89" data-magicpath-path="MyConnectionsPage.tsx">
        {showRevokeModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-magicpath-id="90" data-magicpath-path="MyConnectionsPage.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200" data-magicpath-id="91" data-magicpath-path="MyConnectionsPage.tsx">
              <h3 className="text-2xl font-bold mb-4" data-magicpath-id="92" data-magicpath-path="MyConnectionsPage.tsx">Revoke Contact Access?</h3>
              <p className="text-gray-600 mb-6" data-magicpath-id="93" data-magicpath-path="MyConnectionsPage.tsx">
                This person will no longer have access to your contact details. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-4" data-magicpath-id="94" data-magicpath-path="MyConnectionsPage.tsx">
                <button onClick={() => setShowRevokeModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="95" data-magicpath-path="MyConnectionsPage.tsx">
                  Cancel
                </button>
                <button onClick={() => handleRevokeAccess(showRevokeModal)} className="bg-red-600 text-white px-6 py-3 text-base font-semibold hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20" data-magicpath-id="96" data-magicpath-path="MyConnectionsPage.tsx">
                  Revoke Access
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Decline Request Modal */}
      <AnimatePresence data-magicpath-id="97" data-magicpath-path="MyConnectionsPage.tsx">
        {showDeclineModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-magicpath-id="98" data-magicpath-path="MyConnectionsPage.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200" data-magicpath-id="99" data-magicpath-path="MyConnectionsPage.tsx">
              <h3 className="text-2xl font-bold mb-4" data-magicpath-id="100" data-magicpath-path="MyConnectionsPage.tsx">Decline Connection Request?</h3>
              <p className="text-gray-600 mb-6" data-magicpath-id="101" data-magicpath-path="MyConnectionsPage.tsx">
                This will decline the connection request. You can reconsider this decision later if needed.
              </p>
              <div className="mb-6" data-magicpath-id="102" data-magicpath-path="MyConnectionsPage.tsx">
                <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="103" data-magicpath-path="MyConnectionsPage.tsx">
                  Reason (optional)
                </label>
                <textarea className="w-full p-3 border-2 border-gray-200 focus:border-black focus:outline-none transition-colors resize-none" rows={3} placeholder="Brief reason for declining..." data-magicpath-id="104" data-magicpath-path="MyConnectionsPage.tsx" />
              </div>
              <div className="flex items-center justify-end space-x-4" data-magicpath-id="105" data-magicpath-path="MyConnectionsPage.tsx">
                <button onClick={() => setShowDeclineModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="106" data-magicpath-path="MyConnectionsPage.tsx">
                  Cancel
                </button>
                <button onClick={() => handleDeclineRequest(showDeclineModal)} className="bg-red-600 text-white px-6 py-3 text-base font-semibold hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20" data-magicpath-id="107" data-magicpath-path="MyConnectionsPage.tsx">
                  Decline Request
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="108" data-magicpath-path="MyConnectionsPage.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="109" data-magicpath-path="MyConnectionsPage.tsx">
          <p className="text-lg font-light" data-magicpath-id="110" data-magicpath-path="MyConnectionsPage.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default MyConnectionsPage;