"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Building, CheckCircle, X, MessageSquare, Share2, Clock, Mail, ArrowLeft } from 'lucide-react';
interface PersonProfile {
  name: string;
  role: string;
  company: string;
  currentProject: string;
  profileImage?: string;
}
interface QuestionResponse {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}
interface PreviousResponse {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  isFollowUp: boolean;
}
interface QuestionnaireResponseReviewProps {
  personName?: string;
  opportunityTitle?: string;
  personProfile?: PersonProfile;
  responses?: QuestionResponse[];
  previousResponses?: PreviousResponse[];
  onShareContact?: () => void;
  onDecline?: () => void;
  onFollowUp?: () => void;
  onBack?: () => void;
}
const QuestionnaireResponseReview: React.FC<QuestionnaireResponseReviewProps> = ({
  personName = "Sarah Chen",
  opportunityTitle = "Senior Full Stack Developer",
  personProfile = {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    company: "TechFlow Solutions",
    currentProject: "Building a real-time collaboration platform for remote teams using React, Node.js, and WebSocket technology."
  },
  responses = [{
    id: '1',
    question: 'What specific experience do you have with React and Node.js?',
    answer: 'I have 5+ years of experience with React, including hooks, context API, and state management with Redux. For Node.js, I\'ve built scalable APIs using Express, implemented real-time features with Socket.io, and worked extensively with MongoDB and PostgreSQL databases.',
    timestamp: '2 hours ago'
  }, {
    id: '2',
    question: 'Can you describe a challenging technical problem you solved recently?',
    answer: 'Recently, I optimized a real-time chat system that was experiencing latency issues with 1000+ concurrent users. I implemented Redis for session management, optimized database queries, and used WebSocket connection pooling. This reduced message latency by 70% and improved overall system stability.',
    timestamp: '2 hours ago'
  }, {
    id: '3',
    question: 'What interests you most about this opportunity?',
    answer: 'I\'m excited about the opportunity to work on innovative fintech solutions and contribute to a product that can impact millions of users. The technical challenges around real-time data processing and the collaborative team environment really appeal to me.',
    timestamp: '2 hours ago'
  }],
  previousResponses = [],
  onShareContact,
  onDecline,
  onFollowUp,
  onBack
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState<'share' | 'decline' | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decisionMade, setDecisionMade] = useState<'shared' | 'declined' | null>(null);
  const handleShareContact = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDecisionMade('shared');
    setShowConfirmModal(null);
    setIsLoading(false);
    onShareContact?.();
  };
  const handleDecline = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDecisionMade('declined');
    setShowConfirmModal(null);
    setIsLoading(false);
    onDecline?.();
  };
  const handleFollowUp = async () => {
    if (!followUpQuestion.trim()) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Follow-up question sent:', followUpQuestion);
    setShowFollowUpModal(false);
    setFollowUpQuestion('');
    setIsLoading(false);
    onFollowUp?.();
  };
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Navigate back to Review Grabs');
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
            Review Response from {personName}
          </h2>
          <p className="text-lg font-light text-gray-600">
            Opportunity: {opportunityTitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Response Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Person Profile Summary */}
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="border-2 border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-4">Candidate Profile</h3>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={32} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-2">{personProfile.name}</h4>
                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <span className="font-medium">{personProfile.role}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Building size={16} />
                    <span>{personProfile.company}</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Current Project:</h5>
                  <p className="text-gray-700 leading-relaxed">{personProfile.currentProject}</p>
                </div>
              </div>
            </div>
          </motion.div>

              {/* Previous Responses History */}
              {previousResponses.length > 0 && <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} className="border-2 border-gray-200 p-6">
                  <h3 className="text-xl font-bold mb-4">Previous Responses</h3>
                  <div className="space-y-4">
                    {previousResponses.map((response, index) => <div key={response.id} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-600">
                            {response.isFollowUp ? 'Follow-up Question' : 'Initial Question'}
                          </span>
                          <span className="text-sm text-gray-500">{response.timestamp}</span>
                        </div>
                        <h5 className="font-semibold mb-2">{response.question}</h5>
                        <p className="text-gray-700">{response.answer}</p>
                      </div>)}
                  </div>
                </motion.div>}

              {/* Current Responses */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="border-2 border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-6">Questionnaire Responses</h3>
                <div className="space-y-8">
                  {responses.map((response, index) => <motion.div key={response.id} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.4,
                  delay: index * 0.1
                }} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                        <span className="text-sm text-gray-500">{response.timestamp}</span>
                      </div>
                      <h4 className="text-lg font-semibold mb-3 text-gray-800">
                        {response.question}
                      </h4>
                      <div className="bg-gray-50 p-4 border-l-4 border-black">
                        <p className="text-gray-800 leading-relaxed">{response.answer}</p>
                      </div>
                    </motion.div>)}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Decision Panel */}
            <div className="lg:col-span-1">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.3
            }} className="border-2 border-gray-200 p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-6">Make Decision</h3>

                {/* Decision Status */}
                {decisionMade && <div className={`mb-6 p-4 border-2 ${decisionMade === 'shared' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      {decisionMade === 'shared' ? <>
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="font-semibold text-green-800">Contact Details Shared</span>
                        </> : <>
                          <X size={20} className="text-gray-600" />
                          <span className="font-semibold text-gray-700">Declined to Share</span>
                        </>}
                    </div>
                  </div>}

                {!decisionMade && <div className="space-y-4">
                    {/* Share Contact Button */}
                    <button onClick={() => setShowConfirmModal('share')} disabled={isLoading} className="w-full bg-black text-white py-4 px-6 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2">
                      <Share2 size={20} />
                      <span>Share Contact Details</span>
                    </button>

                    {/* Decline Button */}
                    <button onClick={() => setShowConfirmModal('decline')} disabled={isLoading} className="w-full bg-white text-black py-4 px-6 text-lg font-semibold border-2 border-gray-300 hover:border-black transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2">
                      <X size={20} />
                      <span>Decline to Share</span>
                    </button>

                    {/* Follow-up Questions Button */}
                    <button onClick={() => setShowFollowUpModal(true)} disabled={isLoading} className="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2">
                      <MessageSquare size={20} />
                      <span>Ask Follow-up Questions</span>
                    </button>
                  </div>}

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Clock size={16} />
                    <span className="text-sm">Response received 2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={16} />
                    <span className="text-sm">Candidate will be notified of your decision</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        {/* Confirmation Modals */}
        <AnimatePresence>
          {showConfirmModal && <motion.div initial={{
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
                {showConfirmModal === 'share' ? 'Share Contact Details?' : 'Decline to Share?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {showConfirmModal === 'share' ? `This will share your contact information with ${personName}. They will be able to reach out to you directly.` : `This will decline to share your contact details with ${personName}. You can still ask follow-up questions if needed.`}
              </p>
              <div className="flex items-center justify-end space-x-4">
                <button onClick={() => setShowConfirmModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                  Cancel
                </button>
                <button onClick={showConfirmModal === 'share' ? handleShareContact : handleDecline} disabled={isLoading} className={`px-6 py-3 text-base font-semibold text-white transition-all duration-200 disabled:opacity-50 ${showConfirmModal === 'share' ? 'bg-black hover:bg-gray-900' : 'bg-gray-600 hover:bg-gray-700'}`}>
                  {isLoading ? 'Processing...' : showConfirmModal === 'share' ? 'Share Contact' : 'Decline'}
                </button>
              </div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>

        {/* Follow-up Question Modal */}
        <AnimatePresence>
          {showFollowUpModal && <motion.div initial={{
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
            }} className="bg-white p-8 max-w-lg w-full border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Ask Follow-up Question</h3>
              <p className="text-gray-600 mb-6">
                Send an additional question to {personName} to gather more information before making your decision.
              </p>
              <textarea value={followUpQuestion} onChange={e => setFollowUpQuestion(e.target.value)} placeholder="Type your follow-up question here..." className="w-full h-32 p-4 border-2 border-gray-200 focus:border-black focus:outline-none resize-none text-base" />
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button onClick={() => setShowFollowUpModal(false)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                  Cancel
                </button>
                <button onClick={handleFollowUp} disabled={isLoading || !followUpQuestion.trim()} className="px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50">
                  {isLoading ? 'Sending...' : 'Send Question'}
                </button>
              </div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>
      </>
    );
};
export default QuestionnaireResponseReview;