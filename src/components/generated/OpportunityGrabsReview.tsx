"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Building, ExternalLink, Share2, Send, X, CheckCircle, Clock, AlertCircle, Users, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { opportunitiesService, OpportunityGrabber, OpportunityStats } from '../../services/opportunities';
import { supabase } from '../../services/supabase';
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
  opportunityId: string;
  opportunityTitle?: string;
  onBack?: () => void;
}
const OpportunityGrabsReview: React.FC<OpportunityGrabsReviewProps> = ({
  opportunityId,
  opportunityTitle = "Senior Full Stack Developer",
  onBack
}) => {
  const { user } = useAuth();
  const [selectedGrabbers, setSelectedGrabbers] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState<'contact' | 'questionnaire' | null>(null);
  const [loadingActions, setLoadingActions] = useState<string[]>([]);
  const [grabbers, setGrabbers] = useState<OpportunityGrabber[]>([]);
  const [stats, setStats] = useState<OpportunityStats>({ pending: 0, contact_shared: 0, questionnaire_sent: 0, declined: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load grabbers data
  useEffect(() => {
    const loadGrabbers = async () => {
      if (!user || !opportunityId) return;
      
      try {
        setLoading(true);
        
        // Load opportunity grabs from database
        const { data: grabsData, error: grabsError } = await supabase
          .from('opportunity_grabs')
          .select(`
            *,
            profiles!opportunity_grabs_user_id_fkey (
              id,
              full_name,
              company,
              role,
              building
            )
          `)
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false });

        if (grabsError) {
          console.error('Error loading grabs:', grabsError);
          setError('Failed to load opportunity grabbers');
          return;
        }

        // Transform data to match expected format
        const transformedGrabbers: OpportunityGrabber[] = (grabsData || []).map(grab => ({
          id: grab.id,
          opportunity_id: grab.opportunity_id,
          user_id: grab.user_id,
          status: grab.status as 'pending' | 'contact_shared' | 'questionnaire_sent' | 'declined',
          created_at: grab.created_at,
          updated_at: grab.updated_at,
          user: grab.profiles ? {
            id: grab.profiles.id,
            name: grab.profiles.full_name || 'Unknown User',
            role: grab.profiles.role || 'Member',
            company: grab.profiles.company || 'Unknown Company',
            profile_image: undefined,
            current_project: grab.profiles.building || 'No project information'
          } : undefined
        }));

        setGrabbers(transformedGrabbers);

        // Calculate stats
        const statsData: OpportunityStats = {
          pending: transformedGrabbers.filter(g => g.status === 'pending').length,
          contact_shared: transformedGrabbers.filter(g => g.status === 'contact_shared').length,
          questionnaire_sent: transformedGrabbers.filter(g => g.status === 'questionnaire_sent').length,
          declined: transformedGrabbers.filter(g => g.status === 'declined').length
        };
        
        setStats(statsData);
      } catch (err) {
        setError('Failed to load opportunity grabbers');
        console.error('Error loading grabbers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGrabbers();
  }, [user, opportunityId]);

  // Get status configuration
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

    try {
      let newStatus: string;
      
      switch (action) {
        case 'contact':
          newStatus = 'contact_shared';
          break;
        case 'questionnaire':
          newStatus = 'questionnaire_sent';
          break;
        case 'decline':
          newStatus = 'declined';
          break;
        default:
          throw new Error('Invalid action');
      }

      // Update the grab status in database
      const { error } = await supabase
        .from('opportunity_grabs')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', grabberId);

      if (error) {
        console.error(`Error updating grab status:`, error);
        throw error;
      }

      // Refresh the data by reloading
      const loadGrabbers = async () => {
        const { data: grabsData, error: grabsError } = await supabase
          .from('opportunity_grabs')
          .select(`
            *,
            profiles!opportunity_grabs_user_id_fkey (
              id,
              full_name,
              company,
              role,
              building
            )
          `)
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false });

        if (grabsError) {
          console.error('Error loading grabs:', grabsError);
          return;
        }

        const transformedGrabbers: OpportunityGrabber[] = (grabsData || []).map(grab => ({
          id: grab.id,
          opportunity_id: grab.opportunity_id,
          user_id: grab.user_id,
          status: grab.status as 'pending' | 'contact_shared' | 'questionnaire_sent' | 'declined',
          created_at: grab.created_at,
          updated_at: grab.updated_at,
          user: grab.profiles ? {
            id: grab.profiles.id,
            name: grab.profiles.full_name || 'Unknown User',
            role: grab.profiles.role || 'Member',
            company: grab.profiles.company || 'Unknown Company',
            profile_image: undefined,
            current_project: grab.profiles.building || 'No project information'
          } : undefined
        }));

        setGrabbers(transformedGrabbers);

        const statsData: OpportunityStats = {
          pending: transformedGrabbers.filter(g => g.status === 'pending').length,
          contact_shared: transformedGrabbers.filter(g => g.status === 'contact_shared').length,
          questionnaire_sent: transformedGrabbers.filter(g => g.status === 'questionnaire_sent').length,
          declined: transformedGrabbers.filter(g => g.status === 'declined').length
        };
        
        setStats(statsData);
      };

      await loadGrabbers();
    } catch (err) {
      console.error(`Error performing ${action} action:`, err);
      // You could add a toast notification here
    } finally {
      setLoadingActions(prev => prev.filter(id => id !== `${grabberId}-${action}`));
    }
  };

  const handleBatchAction = async (action: 'contact' | 'questionnaire') => {
    try {
      const pendingGrabbers = await opportunitiesService.getPendingGrabbers(opportunityId);
      
      if (action === 'contact') {
        await opportunitiesService.batchShareContact(pendingGrabbers);
      } else {
        const questionnaireId = 'default-questionnaire-id'; // This should come from props or state
        await opportunitiesService.batchSendQuestionnaire(pendingGrabbers, questionnaireId);
      }
      
      // Refresh data
      const [grabbersData, statsData] = await Promise.all([
        opportunitiesService.getOpportunityGrabbers(opportunityId),
        opportunitiesService.getOpportunityStats(opportunityId)
      ]);
      
      setGrabbers(grabbersData);
      setStats(statsData);
      setShowBatchModal(null);
    } catch (err) {
      console.error(`Error performing batch ${action} action:`, err);
      // You could add a toast notification here
    }
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
  return (
    <>
      {/* Back Navigation and Page Title */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200">
            <ArrowLeft size={20} />
            <span className="text-base font-medium">Back</span>
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

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Loading candidates...</h3>
          <p className="text-gray-600 text-lg">Please wait while we fetch the candidates.</p>
        </motion.div>
      )}

          {/* Error State */}
          {error && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mb-6">
                <AlertCircle size={64} className="mx-auto text-red-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-600">Error Loading Candidates</h3>
              <p className="text-gray-600 text-lg mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-6 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
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
                  <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="border-2 border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.contact_shared}</div>
                  <div className="text-sm text-gray-600">Contact Shared</div>
                </div>
                <div className="border-2 border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.questionnaire_sent}</div>
                  <div className="text-sm text-gray-600">Questionnaire Sent</div>
                </div>
                <div className="border-2 border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{stats.declined}</div>
                  <div className="text-sm text-gray-600">Declined</div>
                </div>
              </motion.div>

              {/* Batch Actions */}
              {stats.pending > 0 && <motion.div initial={{
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
                  <span className="font-medium">{stats.pending} pending candidates</span>
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
            </>
          )}

          {/* Grabbers List */}
          {!loading && !error && (
            <AnimatePresence>
              {grabbers.length > 0 ? (
                <motion.div initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} className="space-y-6">
                  {grabbers.map((grabber, index) => {
                    const statusConfig = getStatusConfig(grabber.status);
                    const isLoading = loadingActions.some(action => action.startsWith(grabber.id));
                    return (
                      <motion.div key={grabber.id} initial={{
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
                                {grabber.user?.name || 'Unknown User'}
                              </h3>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <span>{grabber.user?.role || 'Unknown Role'}</span>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Building size={14} />
                                  <span>{grabber.user?.company || 'Unknown Company'}</span>
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
                              {new Date(grabber.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Current Project */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Project:</h4>
                          <p className="text-gray-700 leading-relaxed">
                            {grabber.user?.current_project || 'No project information available'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <button className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-2 font-medium">
                            <ExternalLink size={16} />
                            <span>View Full Profile</span>
                          </button>
                          
                          <div className="flex items-center space-x-3">
                            {grabber.status === 'pending' && (
                              <>
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
                              </>
                            )}
                            
                            {grabber.status === 'contact_shared' && (
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Contact information shared</span>
                              </div>
                            )}
                            
                            {grabber.status === 'questionnaire_sent' && (
                              <div className="flex items-center space-x-2 text-blue-600">
                                <Mail size={16} />
                                <span className="text-sm font-medium">Questionnaire sent</span>
                              </div>
                            )}
                            
                            {grabber.status === 'declined' && (
                              <div className="flex items-center space-x-2 text-gray-500">
                                <X size={16} />
                                <span className="text-sm font-medium">Declined</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
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
                </motion.div>
              )}
            </AnimatePresence>
          )}

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
                  {showBatchModal === 'contact' ? `This will share your contact information with all ${stats.pending} pending candidates.` : `This will send a questionnaire to all ${stats.pending} pending candidates.`}
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
        </>
      );
    };
export default OpportunityGrabsReview;