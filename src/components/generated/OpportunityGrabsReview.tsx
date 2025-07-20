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
  mpid?: string;
}
interface OpportunityGrabsReviewProps {
  opportunityTitle?: string;
  onBack?: () => void;
  mpid?: string;
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
    grabbedAt: '2 hours ago',
    mpid: "2eaefcba-42f8-48f3-809f-03400acbdafd"
  }, {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Senior Software Engineer',
    company: 'DataVision Inc',
    currentProject: 'Developing an AI-powered analytics dashboard that processes millions of data points in real-time.',
    status: 'contact_shared',
    grabbedAt: '5 hours ago',
    mpid: "0eae24c8-ea8d-4fa3-b4f7-4f57c73e99fa"
  }, {
    id: '3',
    name: 'Emily Watson',
    role: 'Frontend Developer',
    company: 'Creative Labs',
    currentProject: 'Creating an immersive e-commerce experience with 3D product visualization and AR integration.',
    status: 'questionnaire_sent',
    grabbedAt: '1 day ago',
    mpid: "4a7667aa-847e-4484-af55-b54ae5f7195e"
  }, {
    id: '4',
    name: 'David Kim',
    role: 'DevOps Engineer',
    company: 'CloudScale Systems',
    currentProject: 'Architecting a multi-cloud infrastructure solution that reduces deployment time by 80%.',
    status: 'declined',
    grabbedAt: '2 days ago',
    mpid: "bb401e2c-2a1f-4981-bfd7-bd784ba9a9cd"
  }, {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Full Stack Developer',
    company: 'StartupHub',
    currentProject: 'Building a comprehensive project management tool specifically designed for startup teams.',
    status: 'pending',
    grabbedAt: '3 days ago',
    mpid: "26aa27b1-84e1-4e67-a1dc-05ca09768e90"
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
        icon: <Clock size={16} data-magicpath-id="0" data-magicpath-path="OpportunityGrabsReview.tsx" />,
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      contact_shared: {
        label: 'Contact Shared',
        icon: <CheckCircle size={16} data-magicpath-id="1" data-magicpath-path="OpportunityGrabsReview.tsx" />,
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      questionnaire_sent: {
        label: 'Questionnaire Sent',
        icon: <Send size={16} data-magicpath-id="2" data-magicpath-path="OpportunityGrabsReview.tsx" />,
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      declined: {
        label: 'Declined',
        icon: <X size={16} data-magicpath-id="3" data-magicpath-path="OpportunityGrabsReview.tsx" />,
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
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="4" data-magicpath-path="OpportunityGrabsReview.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="5" data-magicpath-path="OpportunityGrabsReview.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="6" data-magicpath-path="OpportunityGrabsReview.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="7" data-magicpath-path="OpportunityGrabsReview.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="8" data-magicpath-path="OpportunityGrabsReview.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Back Navigation */}
          <div className="flex items-center space-x-4 mb-6" data-magicpath-id="9" data-magicpath-path="OpportunityGrabsReview.tsx">
            <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="10" data-magicpath-path="OpportunityGrabsReview.tsx">
              <ChevronLeft size={20} data-magicpath-id="11" data-magicpath-path="OpportunityGrabsReview.tsx" />
              <span className="text-base font-medium" data-magicpath-id="12" data-magicpath-path="OpportunityGrabsReview.tsx">My Opportunities</span>
            </button>
          </div>

          {/* Page Title */}
          <div data-magicpath-id="13" data-magicpath-path="OpportunityGrabsReview.tsx">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" data-magicpath-id="14" data-magicpath-path="OpportunityGrabsReview.tsx">
              People Interested in: {opportunityTitle}
            </h2>
            <p className="text-lg font-light text-gray-600" data-magicpath-id="15" data-magicpath-path="OpportunityGrabsReview.tsx">
              Review and manage candidates who have grabbed this opportunity
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="16" data-magicpath-path="OpportunityGrabsReview.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="17" data-magicpath-path="OpportunityGrabsReview.tsx">
          
          {/* Stats Overview */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-magicpath-id="18" data-magicpath-path="OpportunityGrabsReview.tsx">
            <div className="border-2 border-gray-200 p-4 text-center" data-magicpath-id="19" data-magicpath-path="OpportunityGrabsReview.tsx">
              <div className="text-2xl font-bold text-orange-600" data-magicpath-id="20" data-magicpath-path="OpportunityGrabsReview.tsx">{statusCounts.pending}</div>
              <div className="text-sm text-gray-600" data-magicpath-id="21" data-magicpath-path="OpportunityGrabsReview.tsx">Pending</div>
            </div>
            <div className="border-2 border-gray-200 p-4 text-center" data-magicpath-id="22" data-magicpath-path="OpportunityGrabsReview.tsx">
              <div className="text-2xl font-bold text-green-600" data-magicpath-id="23" data-magicpath-path="OpportunityGrabsReview.tsx">{statusCounts.contact_shared}</div>
              <div className="text-sm text-gray-600" data-magicpath-id="24" data-magicpath-path="OpportunityGrabsReview.tsx">Contact Shared</div>
            </div>
            <div className="border-2 border-gray-200 p-4 text-center" data-magicpath-id="25" data-magicpath-path="OpportunityGrabsReview.tsx">
              <div className="text-2xl font-bold text-blue-600" data-magicpath-id="26" data-magicpath-path="OpportunityGrabsReview.tsx">{statusCounts.questionnaire_sent}</div>
              <div className="text-sm text-gray-600" data-magicpath-id="27" data-magicpath-path="OpportunityGrabsReview.tsx">Questionnaire Sent</div>
            </div>
            <div className="border-2 border-gray-200 p-4 text-center" data-magicpath-id="28" data-magicpath-path="OpportunityGrabsReview.tsx">
              <div className="text-2xl font-bold text-gray-600" data-magicpath-id="29" data-magicpath-path="OpportunityGrabsReview.tsx">{statusCounts.declined}</div>
              <div className="text-sm text-gray-600" data-magicpath-id="30" data-magicpath-path="OpportunityGrabsReview.tsx">Declined</div>
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
        }} className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-gray-50 border-2 border-gray-200" data-magicpath-id="31" data-magicpath-path="OpportunityGrabsReview.tsx">
              <div className="flex items-center space-x-2 text-gray-700" data-magicpath-id="32" data-magicpath-path="OpportunityGrabsReview.tsx">
                <Users size={20} data-magicpath-id="33" data-magicpath-path="OpportunityGrabsReview.tsx" />
                <span className="font-medium" data-magicpath-id="34" data-magicpath-path="OpportunityGrabsReview.tsx">{statusCounts.pending} pending candidates</span>
              </div>
              <div className="flex items-center space-x-3" data-magicpath-id="35" data-magicpath-path="OpportunityGrabsReview.tsx">
                <button onClick={() => setShowBatchModal('contact')} className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-all duration-200 flex items-center space-x-2" data-magicpath-id="36" data-magicpath-path="OpportunityGrabsReview.tsx">
                  <Share2 size={16} data-magicpath-id="37" data-magicpath-path="OpportunityGrabsReview.tsx" />
                  <span data-magicpath-id="38" data-magicpath-path="OpportunityGrabsReview.tsx">Share contact with all</span>
                </button>
                <button onClick={() => setShowBatchModal('questionnaire')} className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2" data-magicpath-id="39" data-magicpath-path="OpportunityGrabsReview.tsx">
                  <Send size={16} data-magicpath-id="40" data-magicpath-path="OpportunityGrabsReview.tsx" />
                  <span data-magicpath-id="41" data-magicpath-path="OpportunityGrabsReview.tsx">Send questionnaire to all</span>
                </button>
              </div>
            </motion.div>}

          {/* Grabbers List */}
          <AnimatePresence data-magicpath-id="42" data-magicpath-path="OpportunityGrabsReview.tsx">
            {mockGrabbers.length > 0 ? <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="space-y-6" data-magicpath-id="43" data-magicpath-path="OpportunityGrabsReview.tsx">
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
              }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300 hover:shadow-lg" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="44" data-magicpath-path="OpportunityGrabsReview.tsx">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="45" data-magicpath-path="OpportunityGrabsReview.tsx">
                        <div className="flex items-center space-x-4" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="46" data-magicpath-path="OpportunityGrabsReview.tsx">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="47" data-magicpath-path="OpportunityGrabsReview.tsx">
                            <User size={24} className="text-gray-600" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="48" data-magicpath-path="OpportunityGrabsReview.tsx" />
                          </div>
                          <div data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="49" data-magicpath-path="OpportunityGrabsReview.tsx">
                            <h3 className="text-xl font-bold" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:string" data-magicpath-id="50" data-magicpath-path="OpportunityGrabsReview.tsx">
                              {grabber.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-gray-600" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="51" data-magicpath-path="OpportunityGrabsReview.tsx">
                              <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-field="role:string" data-magicpath-id="52" data-magicpath-path="OpportunityGrabsReview.tsx">{grabber.role}</span>
                              <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="53" data-magicpath-path="OpportunityGrabsReview.tsx">•</span>
                              <div className="flex items-center space-x-1" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="54" data-magicpath-path="OpportunityGrabsReview.tsx">
                                <Building size={14} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="55" data-magicpath-path="OpportunityGrabsReview.tsx" />
                                <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-field="company:string" data-magicpath-id="56" data-magicpath-path="OpportunityGrabsReview.tsx">{grabber.company}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="57" data-magicpath-path="OpportunityGrabsReview.tsx">
                          <span className={`px-3 py-1 text-sm font-medium border flex items-center space-x-1 ${statusConfig.className}`} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="58" data-magicpath-path="OpportunityGrabsReview.tsx">
                            {statusConfig.icon}
                            <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="59" data-magicpath-path="OpportunityGrabsReview.tsx">{statusConfig.label}</span>
                          </span>
                          <span className="text-sm text-gray-500" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-field="grabbedAt:string" data-magicpath-id="60" data-magicpath-path="OpportunityGrabsReview.tsx">
                            {grabber.grabbedAt}
                          </span>
                        </div>
                      </div>

                      {/* Current Project */}
                      <div className="mb-6" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="61" data-magicpath-path="OpportunityGrabsReview.tsx">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="62" data-magicpath-path="OpportunityGrabsReview.tsx">Current Project:</h4>
                        <p className="text-gray-700 leading-relaxed" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-field="currentProject:string" data-magicpath-id="63" data-magicpath-path="OpportunityGrabsReview.tsx">
                          {grabber.currentProject}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="64" data-magicpath-path="OpportunityGrabsReview.tsx">
                        <button className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-2 font-medium" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="65" data-magicpath-path="OpportunityGrabsReview.tsx">
                          <ExternalLink size={16} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="66" data-magicpath-path="OpportunityGrabsReview.tsx" />
                          <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="OpportunityGrabsReview.tsx">View Full Profile</span>
                        </button>
                        
                        <div className="flex items-center space-x-3" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="68" data-magicpath-path="OpportunityGrabsReview.tsx">
                          {grabber.status === 'pending' && <>
                              <button onClick={() => handleIndividualAction(grabber.id, 'contact')} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="69" data-magicpath-path="OpportunityGrabsReview.tsx">
                                <Share2 size={14} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="70" data-magicpath-path="OpportunityGrabsReview.tsx" />
                                <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="71" data-magicpath-path="OpportunityGrabsReview.tsx">Share Contact</span>
                              </button>
                              <button onClick={() => handleIndividualAction(grabber.id, 'questionnaire')} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="72" data-magicpath-path="OpportunityGrabsReview.tsx">
                                <Send size={14} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="73" data-magicpath-path="OpportunityGrabsReview.tsx" />
                                <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="74" data-magicpath-path="OpportunityGrabsReview.tsx">Send Questionnaire</span>
                              </button>
                              <button onClick={() => handleIndividualAction(grabber.id, 'decline')} disabled={isLoading} className="text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="75" data-magicpath-path="OpportunityGrabsReview.tsx">
                                <X size={14} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="76" data-magicpath-path="OpportunityGrabsReview.tsx" />
                                <span data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="77" data-magicpath-path="OpportunityGrabsReview.tsx">Decline</span>
                              </button>
                            </>}
                          
                          {grabber.status === 'contact_shared' && <div className="flex items-center space-x-2 text-green-600" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="78" data-magicpath-path="OpportunityGrabsReview.tsx">
                              <CheckCircle size={16} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="79" data-magicpath-path="OpportunityGrabsReview.tsx" />
                              <span className="text-sm font-medium" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="80" data-magicpath-path="OpportunityGrabsReview.tsx">Contact information shared</span>
                            </div>}
                          
                          {grabber.status === 'questionnaire_sent' && <div className="flex items-center space-x-2 text-blue-600" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="81" data-magicpath-path="OpportunityGrabsReview.tsx">
                              <Mail size={16} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="82" data-magicpath-path="OpportunityGrabsReview.tsx" />
                              <span className="text-sm font-medium" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="83" data-magicpath-path="OpportunityGrabsReview.tsx">Questionnaire sent</span>
                            </div>}
                          
                          {grabber.status === 'declined' && <div className="flex items-center space-x-2 text-gray-500" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="84" data-magicpath-path="OpportunityGrabsReview.tsx">
                              <X size={16} data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="85" data-magicpath-path="OpportunityGrabsReview.tsx" />
                              <span className="text-sm font-medium" data-magicpath-uuid={(grabber as any)["mpid"] ?? "unsafe"} data-magicpath-id="86" data-magicpath-path="OpportunityGrabsReview.tsx">Declined</span>
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
          }} className="text-center py-16" data-magicpath-id="87" data-magicpath-path="OpportunityGrabsReview.tsx">
                <div className="mb-6" data-magicpath-id="88" data-magicpath-path="OpportunityGrabsReview.tsx">
                  <AlertCircle size={64} className="mx-auto text-gray-300" data-magicpath-id="89" data-magicpath-path="OpportunityGrabsReview.tsx" />
                </div>
                <h3 className="text-2xl font-bold mb-4" data-magicpath-id="90" data-magicpath-path="OpportunityGrabsReview.tsx">
                  No one has grabbed this opportunity yet
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto" data-magicpath-id="91" data-magicpath-path="OpportunityGrabsReview.tsx">
                  When people grab your opportunity, they'll appear here for you to review and connect with.
                </p>
              </motion.div>}
          </AnimatePresence>
        </div>
      </main>

      {/* Batch Action Confirmation Modals */}
      <AnimatePresence data-magicpath-id="92" data-magicpath-path="OpportunityGrabsReview.tsx">
        {showBatchModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-magicpath-id="93" data-magicpath-path="OpportunityGrabsReview.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200" data-magicpath-id="94" data-magicpath-path="OpportunityGrabsReview.tsx">
              <h3 className="text-2xl font-bold mb-4" data-magicpath-id="95" data-magicpath-path="OpportunityGrabsReview.tsx">
                {showBatchModal === 'contact' ? 'Share Contact with All?' : 'Send Questionnaire to All?'}
              </h3>
              <p className="text-gray-600 mb-6" data-magicpath-id="96" data-magicpath-path="OpportunityGrabsReview.tsx">
                {showBatchModal === 'contact' ? `This will share your contact information with all ${statusCounts.pending} pending candidates.` : `This will send a questionnaire to all ${statusCounts.pending} pending candidates.`}
              </p>
              <div className="flex items-center justify-end space-x-4" data-magicpath-id="97" data-magicpath-path="OpportunityGrabsReview.tsx">
                <button onClick={() => setShowBatchModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="98" data-magicpath-path="OpportunityGrabsReview.tsx">
                  Cancel
                </button>
                <button onClick={() => handleBatchAction(showBatchModal)} className={`px-6 py-3 text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 ${showBatchModal === 'contact' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-600' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600'}`} data-magicpath-id="99" data-magicpath-path="OpportunityGrabsReview.tsx">
                  {showBatchModal === 'contact' ? 'Share Contact' : 'Send Questionnaire'}
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="100" data-magicpath-path="OpportunityGrabsReview.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="101" data-magicpath-path="OpportunityGrabsReview.tsx">
          <p className="text-lg font-light" data-magicpath-id="102" data-magicpath-path="OpportunityGrabsReview.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default OpportunityGrabsReview;