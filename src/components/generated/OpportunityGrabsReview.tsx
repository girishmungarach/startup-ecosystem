"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Building, ExternalLink, Share2, Send, X, CheckCircle, Clock, AlertCircle, Users, Mail } from 'lucide-react';
interface GrabberProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  currentProject: string;
  profileImage?: string;
  status: 'pending' | 'contact_shared' | 'declined' | 'questionnaire_sent';
  grabbedAt: string;
}
interface OpportunityGrabsReviewProps {
  opportunityTitle?: string;
  onBack?: () => void;
}
const OpportunityGrabsReview: React.FC<OpportunityGrabsReviewProps> = ({
  opportunityTitle = "Senior Full Stack Developer",
  onBack
}) => {
  const [selectedGrabbers, setSelectedGrabbers] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState<'contact' | 'questionnaire' | null>(null);
  const [loadingActions, setLoadingActions] = useState<string[]>([]);

  // Mock data for people who grabbed the opportunity
  const mockGrabbers: GrabberProfile[] = [{
    id: '1',
    name: 'Sarah Chen',
    role: 'Full Stack Developer',
    company: 'TechFlow Solutions',
    currentProject: 'Building a real-time collaboration platform for remote teams using React, Node.js, and WebSocket technology.',
    status: 'pending',
    grabbedAt: '2 hours ago'
  }, {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Senior Software Engineer',
    company: 'DataVision Inc',
    currentProject: 'Developing an AI-powered analytics dashboard that processes millions of data points in real-time.',
    status: 'contact_shared',
    grabbedAt: '5 hours ago'
  }, {
    id: '3',
    name: 'Emily Watson',
    role: 'Frontend Developer',
    company: 'Creative Labs',
    currentProject: 'Creating an immersive e-commerce experience with 3D product visualization and AR integration.',
    status: 'questionnaire_sent',
    grabbedAt: '1 day ago'
  }, {
    id: '4',
    name: 'David Kim',
    role: 'DevOps Engineer',
    company: 'CloudScale Systems',
    currentProject: 'Architecting a multi-cloud infrastructure solution that reduces deployment time by 80%.',
    status: 'declined',
    grabbedAt: '2 days ago'
  }, {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Full Stack Developer',
    company: 'StartupHub',
    currentProject: 'Building a comprehensive project management tool specifically designed for startup teams.',
    status: 'pending',
    grabbedAt: '3 days ago'
  }];

  // Filter and count by status
  const statusCounts = useMemo(() => {
    return {
      pending: mockGrabbers.filter(g => g.status === 'pending').length,
      contact_shared: mockGrabbers.filter(g => g.status === 'contact_shared').length,
      questionnaire_sent: mockGrabbers.filter(g => g.status === 'questionnaire_sent').length,
      declined: mockGrabbers.filter(g => g.status === 'declined').length
    };
  }, [mockGrabbers]);
  const getStatusConfig = (status: GrabberProfile['status']) => {
    const configs = {
      pending: {
        label: 'Pending',
        icon: <Clock size={16} />,
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      contact_shared: {
        label: 'Contact Shared',
        icon: <CheckCircle size={16} />,
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      questionnaire_sent: {
        label: 'Questionnaire Sent',
        icon: <Send size={16} />,
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      declined: {
        label: 'Declined',
        icon: <X size={16} />,
        className: 'bg-gray-100 text-gray-600 border-gray-200'
      }
    };
    return configs[status];
  };
  const handleIndividualAction = async (grabberId: string, action: 'contact' | 'questionnaire' | 'decline') => {
    setLoadingActions(prev => [...prev, `${grabberId}-${action}`]);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`${action} action for grabber:`, grabberId);
    setLoadingActions(prev => prev.filter(id => id !== `${grabberId}-${action}`));
  };
  const handleBatchAction = async (action: 'contact' | 'questionnaire') => {
    const pendingGrabbers = mockGrabbers.filter(g => g.status === 'pending').map(g => g.id);
    console.log(`Batch ${action} action for grabbers:`, pendingGrabbers);
    setShowBatchModal(null);
  };
  const handleSelectGrabber = (grabberId: string) => {
    setSelectedGrabbers(prev => prev.includes(grabberId) ? prev.filter(id => id !== grabberId) : [...prev, grabberId]);
  };
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Navigate back to My Opportunities');
    }
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
          
          {/* Back Navigation */}
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200">
              <ChevronLeft size={20} />
              <span className="text-base font-medium">My Opportunities</span>
            </button>
          </div>

          {/* Page Title */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              People Interested in: {opportunityTitle}
            </h2>
            <p className="text-lg font-light text-gray-600">
              Review and manage candidates who have grabbed this opportunity
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Stats Overview */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border-2 border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="border-2 border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.contact_shared}</div>
              <div className="text-sm text-gray-600">Contact Shared</div>
            </div>
            <div className="border-2 border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.questionnaire_sent}</div>
              <div className="text-sm text-gray-600">Questionnaire Sent</div>
            </div>
            <div className="border-2 border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.declined}</div>
              <div className="text-sm text-gray-600">Declined</div>
            </div>
          </motion.div>

          {/* Batch Actions */}
          {statusCounts.pending > 0 && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-gray-50 border-2 border-gray-200">
              <div className="flex items-center space-x-2 text-gray-700">
                <Users size={20} />
                <span className="font-medium">{statusCounts.pending} pending candidates</span>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setShowBatchModal('contact')} className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-all duration-200 flex items-center space-x-2">
                  <Share2 size={16} />
                  <span>Share contact with all</span>
                </button>
                <button onClick={() => setShowBatchModal('questionnaire')} className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2">
                  <Send size={16} />
                  <span>Send questionnaire to all</span>
                </button>
              </div>
            </motion.div>}

          {/* Grabbers List */}
          <AnimatePresence>
            {mockGrabbers.length > 0 ? <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="space-y-6">
                {mockGrabbers.map((grabber, index) => {
              const statusConfig = getStatusConfig(grabber.status);
              const isLoading = loadingActions.some(action => action.startsWith(grabber.id));
              return <motion.div key={grabber.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.4,
                delay: index * 0.1
              }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 hover:shadow-lg">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={24} className="text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">
                              {grabber.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span>{grabber.role}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Building size={14} />
                                <span>{grabber.company}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm font-medium border flex items-center space-x-1 ${statusConfig.className}`}>
                            {statusConfig.icon}
                            <span>{statusConfig.label}</span>
                          </span>
                          <span className="text-sm text-gray-500">
                            {grabber.grabbedAt}
                          </span>
                        </div>
                      </div>

                      {/* Current Project */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Project:</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {grabber.currentProject}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-2 font-medium">
                          <ExternalLink size={16} />
                          <span>View Full Profile</span>
                        </button>
                        
                        <div className="flex items-center space-x-3">
                          {grabber.status === 'pending' && <>
                              <button onClick={() => handleIndividualAction(grabber.id, 'contact')} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2">
                                <Share2 size={14} />
                                <span>Share Contact</span>
                              </button>
                              <button onClick={() => handleIndividualAction(grabber.id, 'questionnaire')} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2">
                                <Send size={14} />
                                <span>Send Questionnaire</span>
                              </button>
                              <button onClick={() => handleIndividualAction(grabber.id, 'decline')} disabled={isLoading} className="text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2">
                                <X size={14} />
                                <span>Decline</span>
                              </button>
                            </>}
                          
                          {grabber.status === 'contact_shared' && <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium">Contact information shared</span>
                            </div>}
                          
                          {grabber.status === 'questionnaire_sent' && <div className="flex items-center space-x-2 text-blue-600">
                              <Mail size={16} />
                              <span className="text-sm font-medium">Questionnaire sent</span>
                            </div>}
                          
                          {grabber.status === 'declined' && <div className="flex items-center space-x-2 text-gray-500">
                              <X size={16} />
                              <span className="text-sm font-medium">Declined</span>
                            </div>}
                        </div>
                      </div>
                    </motion.div>;
            })}
              </motion.div> :
          // Empty State
          <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="text-center py-16">
                <div className="mb-6">
                  <AlertCircle size={64} className="mx-auto text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  No one has grabbed this opportunity yet
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  When people grab your opportunity, they'll appear here for you to review and connect with.
                </p>
              </motion.div>}
          </AnimatePresence>
        </div>
      </main>

      {/* Batch Action Confirmation Modals */}
      <AnimatePresence>
        {showBatchModal && <motion.div initial={{
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
              <h3 className="text-2xl font-bold mb-4">
                {showBatchModal === 'contact' ? 'Share Contact with All?' : 'Send Questionnaire to All?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {showBatchModal === 'contact' ? `This will share your contact information with all ${statusCounts.pending} pending candidates.` : `This will send a questionnaire to all ${statusCounts.pending} pending candidates.`}
              </p>
              <div className="flex items-center justify-end space-x-4">
                <button onClick={() => setShowBatchModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                  Cancel
                </button>
                <button onClick={() => handleBatchAction(showBatchModal)} className={`px-6 py-3 text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 ${showBatchModal === 'contact' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-600' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600'}`}>
                  {showBatchModal === 'contact' ? 'Share Contact' : 'Send Questionnaire'}
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
export default OpportunityGrabsReview;