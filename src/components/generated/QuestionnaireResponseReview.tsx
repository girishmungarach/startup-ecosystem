"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Building, CheckCircle, X, MessageSquare, Share2, Clock, Mail } from 'lucide-react';
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
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="0" data-magicpath-path="QuestionnaireResponseReview.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="1" data-magicpath-path="QuestionnaireResponseReview.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="QuestionnaireResponseReview.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="3" data-magicpath-path="QuestionnaireResponseReview.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="4" data-magicpath-path="QuestionnaireResponseReview.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Back Navigation */}
          <div className="flex items-center space-x-4 mb-6" data-magicpath-id="5" data-magicpath-path="QuestionnaireResponseReview.tsx">
            <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="6" data-magicpath-path="QuestionnaireResponseReview.tsx">
              <ChevronLeft size={20} data-magicpath-id="7" data-magicpath-path="QuestionnaireResponseReview.tsx" />
              <span className="text-base font-medium" data-magicpath-id="8" data-magicpath-path="QuestionnaireResponseReview.tsx">Review Grabs</span>
            </button>
          </div>

          {/* Page Title */}
          <div data-magicpath-id="9" data-magicpath-path="QuestionnaireResponseReview.tsx">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" data-magicpath-id="10" data-magicpath-path="QuestionnaireResponseReview.tsx">
              Review Response from {personName}
            </h2>
            <p className="text-lg font-light text-gray-600" data-magicpath-id="11" data-magicpath-path="QuestionnaireResponseReview.tsx">
              Opportunity: {opportunityTitle}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="12" data-magicpath-path="QuestionnaireResponseReview.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="13" data-magicpath-path="QuestionnaireResponseReview.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-magicpath-id="14" data-magicpath-path="QuestionnaireResponseReview.tsx">
            
            {/* Left Column - Response Content */}
            <div className="lg:col-span-2 space-y-8" data-magicpath-id="15" data-magicpath-path="QuestionnaireResponseReview.tsx">
              
              {/* Person Profile Summary */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="border-2 border-gray-200 p-6" data-magicpath-id="16" data-magicpath-path="QuestionnaireResponseReview.tsx">
                <h3 className="text-xl font-bold mb-4" data-magicpath-id="17" data-magicpath-path="QuestionnaireResponseReview.tsx">Candidate Profile</h3>
                <div className="flex items-start space-x-4" data-magicpath-id="18" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0" data-magicpath-id="19" data-magicpath-path="QuestionnaireResponseReview.tsx">
                    <User size={32} className="text-gray-600" data-magicpath-id="20" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                  </div>
                  <div className="flex-1" data-magicpath-id="21" data-magicpath-path="QuestionnaireResponseReview.tsx">
                    <h4 className="text-2xl font-bold mb-2" data-magicpath-id="22" data-magicpath-path="QuestionnaireResponseReview.tsx">{personProfile.name}</h4>
                    <div className="flex items-center space-x-2 text-gray-600 mb-3" data-magicpath-id="23" data-magicpath-path="QuestionnaireResponseReview.tsx">
                      <span className="font-medium" data-magicpath-id="24" data-magicpath-path="QuestionnaireResponseReview.tsx">{personProfile.role}</span>
                      <span data-magicpath-id="25" data-magicpath-path="QuestionnaireResponseReview.tsx">•</span>
                      <div className="flex items-center space-x-1" data-magicpath-id="26" data-magicpath-path="QuestionnaireResponseReview.tsx">
                        <Building size={16} data-magicpath-id="27" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                        <span data-magicpath-id="28" data-magicpath-path="QuestionnaireResponseReview.tsx">{personProfile.company}</span>
                      </div>
                    </div>
                    <div data-magicpath-id="29" data-magicpath-path="QuestionnaireResponseReview.tsx">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2" data-magicpath-id="30" data-magicpath-path="QuestionnaireResponseReview.tsx">Current Project:</h5>
                      <p className="text-gray-700 leading-relaxed" data-magicpath-id="31" data-magicpath-path="QuestionnaireResponseReview.tsx">{personProfile.currentProject}</p>
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
            }} className="border-2 border-gray-200 p-6" data-magicpath-id="32" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  <h3 className="text-xl font-bold mb-4" data-magicpath-id="33" data-magicpath-path="QuestionnaireResponseReview.tsx">Previous Responses</h3>
                  <div className="space-y-4" data-magicpath-id="34" data-magicpath-path="QuestionnaireResponseReview.tsx">
                    {previousResponses.map((response, index) => <div key={response.id} className="border-l-4 border-blue-200 pl-4" data-magicpath-id="35" data-magicpath-path="QuestionnaireResponseReview.tsx">
                        <div className="flex items-center justify-between mb-2" data-magicpath-id="36" data-magicpath-path="QuestionnaireResponseReview.tsx">
                          <span className="text-sm font-medium text-blue-600" data-magicpath-id="37" data-magicpath-path="QuestionnaireResponseReview.tsx">
                            {response.isFollowUp ? 'Follow-up Question' : 'Initial Question'}
                          </span>
                          <span className="text-sm text-gray-500" data-magicpath-id="38" data-magicpath-path="QuestionnaireResponseReview.tsx">{response.timestamp}</span>
                        </div>
                        <h5 className="font-semibold mb-2" data-magicpath-id="39" data-magicpath-path="QuestionnaireResponseReview.tsx">{response.question}</h5>
                        <p className="text-gray-700" data-magicpath-id="40" data-magicpath-path="QuestionnaireResponseReview.tsx">{response.answer}</p>
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
            }} className="border-2 border-gray-200 p-6" data-magicpath-id="41" data-magicpath-path="QuestionnaireResponseReview.tsx">
                <h3 className="text-xl font-bold mb-6" data-magicpath-id="42" data-magicpath-path="QuestionnaireResponseReview.tsx">Questionnaire Responses</h3>
                <div className="space-y-8" data-magicpath-id="43" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  {responses.map((response, index) => <motion.div key={response.id} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.4,
                  delay: index * 0.1
                }} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0" data-magicpath-id="44" data-magicpath-path="QuestionnaireResponseReview.tsx">
                      <div className="flex items-center justify-between mb-3" data-magicpath-id="45" data-magicpath-path="QuestionnaireResponseReview.tsx">
                        <span className="text-sm font-medium text-gray-500" data-magicpath-id="46" data-magicpath-path="QuestionnaireResponseReview.tsx">Question {index + 1}</span>
                        <span className="text-sm text-gray-500" data-magicpath-id="47" data-magicpath-path="QuestionnaireResponseReview.tsx">{response.timestamp}</span>
                      </div>
                      <h4 className="text-lg font-semibold mb-3 text-gray-800" data-magicpath-id="48" data-magicpath-path="QuestionnaireResponseReview.tsx">
                        {response.question}
                      </h4>
                      <div className="bg-gray-50 p-4 border-l-4 border-black" data-magicpath-id="49" data-magicpath-path="QuestionnaireResponseReview.tsx">
                        <p className="text-gray-800 leading-relaxed" data-magicpath-id="50" data-magicpath-path="QuestionnaireResponseReview.tsx">{response.answer}</p>
                      </div>
                    </motion.div>)}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Decision Panel */}
            <div className="lg:col-span-1" data-magicpath-id="51" data-magicpath-path="QuestionnaireResponseReview.tsx">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.3
            }} className="border-2 border-gray-200 p-6 sticky top-8" data-magicpath-id="52" data-magicpath-path="QuestionnaireResponseReview.tsx">
                <h3 className="text-xl font-bold mb-6" data-magicpath-id="53" data-magicpath-path="QuestionnaireResponseReview.tsx">Make Decision</h3>

                {/* Decision Status */}
                {decisionMade && <div className={`mb-6 p-4 border-2 ${decisionMade === 'shared' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`} data-magicpath-id="54" data-magicpath-path="QuestionnaireResponseReview.tsx">
                    <div className="flex items-center space-x-2" data-magicpath-id="55" data-magicpath-path="QuestionnaireResponseReview.tsx">
                      {decisionMade === 'shared' ? <>
                          <CheckCircle size={20} className="text-green-600" data-magicpath-id="56" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                          <span className="font-semibold text-green-800" data-magicpath-id="57" data-magicpath-path="QuestionnaireResponseReview.tsx">Contact Details Shared</span>
                        </> : <>
                          <X size={20} className="text-gray-600" data-magicpath-id="58" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                          <span className="font-semibold text-gray-700" data-magicpath-id="59" data-magicpath-path="QuestionnaireResponseReview.tsx">Declined to Share</span>
                        </>}
                    </div>
                  </div>}

                {!decisionMade && <div className="space-y-4" data-magicpath-id="60" data-magicpath-path="QuestionnaireResponseReview.tsx">
                    {/* Share Contact Button */}
                    <button onClick={() => setShowConfirmModal('share')} disabled={isLoading} className="w-full bg-black text-white py-4 px-6 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2" data-magicpath-id="61" data-magicpath-path="QuestionnaireResponseReview.tsx">
                      <Share2 size={20} data-magicpath-id="62" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                      <span data-magicpath-id="63" data-magicpath-path="QuestionnaireResponseReview.tsx">Share Contact Details</span>
                    </button>

                    {/* Decline Button */}
                    <button onClick={() => setShowConfirmModal('decline')} disabled={isLoading} className="w-full bg-white text-black py-4 px-6 text-lg font-semibold border-2 border-gray-300 hover:border-black transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2" data-magicpath-id="64" data-magicpath-path="QuestionnaireResponseReview.tsx">
                      <X size={20} data-magicpath-id="65" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                      <span data-magicpath-id="66" data-magicpath-path="QuestionnaireResponseReview.tsx">Decline to Share</span>
                    </button>

                    {/* Follow-up Questions Button */}
                    <button onClick={() => setShowFollowUpModal(true)} disabled={isLoading} className="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2" data-magicpath-id="67" data-magicpath-path="QuestionnaireResponseReview.tsx">
                      <MessageSquare size={20} data-magicpath-id="68" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                      <span data-magicpath-id="69" data-magicpath-path="QuestionnaireResponseReview.tsx">Ask Follow-up Questions</span>
                    </button>
                  </div>}

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200" data-magicpath-id="70" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  <div className="flex items-center space-x-2 text-gray-600 mb-2" data-magicpath-id="71" data-magicpath-path="QuestionnaireResponseReview.tsx">
                    <Clock size={16} data-magicpath-id="72" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                    <span className="text-sm" data-magicpath-id="73" data-magicpath-path="QuestionnaireResponseReview.tsx">Response received 2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600" data-magicpath-id="74" data-magicpath-path="QuestionnaireResponseReview.tsx">
                    <Mail size={16} data-magicpath-id="75" data-magicpath-path="QuestionnaireResponseReview.tsx" />
                    <span className="text-sm" data-magicpath-id="76" data-magicpath-path="QuestionnaireResponseReview.tsx">Candidate will be notified of your decision</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modals */}
      <AnimatePresence data-magicpath-id="77" data-magicpath-path="QuestionnaireResponseReview.tsx">
        {showConfirmModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-magicpath-id="78" data-magicpath-path="QuestionnaireResponseReview.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200" data-magicpath-id="79" data-magicpath-path="QuestionnaireResponseReview.tsx">
              <h3 className="text-2xl font-bold mb-4" data-magicpath-id="80" data-magicpath-path="QuestionnaireResponseReview.tsx">
                {showConfirmModal === 'share' ? 'Share Contact Details?' : 'Decline to Share?'}
              </h3>
              <p className="text-gray-600 mb-6" data-magicpath-id="81" data-magicpath-path="QuestionnaireResponseReview.tsx">
                {showConfirmModal === 'share' ? `This will share your contact information with ${personName}. They will be able to reach out to you directly.` : `This will decline to share your contact details with ${personName}. You can still ask follow-up questions if needed.`}
              </p>
              <div className="flex items-center justify-end space-x-4" data-magicpath-id="82" data-magicpath-path="QuestionnaireResponseReview.tsx">
                <button onClick={() => setShowConfirmModal(null)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="83" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  Cancel
                </button>
                <button onClick={showConfirmModal === 'share' ? handleShareContact : handleDecline} disabled={isLoading} className={`px-6 py-3 text-base font-semibold text-white transition-all duration-200 disabled:opacity-50 ${showConfirmModal === 'share' ? 'bg-black hover:bg-gray-900' : 'bg-gray-600 hover:bg-gray-700'}`} data-magicpath-id="84" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  {isLoading ? 'Processing...' : showConfirmModal === 'share' ? 'Share Contact' : 'Decline'}
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Follow-up Question Modal */}
      <AnimatePresence data-magicpath-id="85" data-magicpath-path="QuestionnaireResponseReview.tsx">
        {showFollowUpModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-magicpath-id="86" data-magicpath-path="QuestionnaireResponseReview.tsx">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} className="bg-white p-8 max-w-lg w-full border-2 border-gray-200" data-magicpath-id="87" data-magicpath-path="QuestionnaireResponseReview.tsx">
              <h3 className="text-2xl font-bold mb-4" data-magicpath-id="88" data-magicpath-path="QuestionnaireResponseReview.tsx">Ask Follow-up Question</h3>
              <p className="text-gray-600 mb-6" data-magicpath-id="89" data-magicpath-path="QuestionnaireResponseReview.tsx">
                Send an additional question to {personName} to gather more information before making your decision.
              </p>
              <textarea value={followUpQuestion} onChange={e => setFollowUpQuestion(e.target.value)} placeholder="Type your follow-up question here..." className="w-full h-32 p-4 border-2 border-gray-200 focus:border-black focus:outline-none resize-none text-base" data-magicpath-id="90" data-magicpath-path="QuestionnaireResponseReview.tsx" />
              <div className="flex items-center justify-end space-x-4 mt-6" data-magicpath-id="91" data-magicpath-path="QuestionnaireResponseReview.tsx">
                <button onClick={() => setShowFollowUpModal(false)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="92" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  Cancel
                </button>
                <button onClick={handleFollowUp} disabled={isLoading || !followUpQuestion.trim()} className="px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50" data-magicpath-id="93" data-magicpath-path="QuestionnaireResponseReview.tsx">
                  {isLoading ? 'Sending...' : 'Send Question'}
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="94" data-magicpath-path="QuestionnaireResponseReview.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="95" data-magicpath-path="QuestionnaireResponseReview.tsx">
          <p className="text-lg font-light" data-magicpath-id="96" data-magicpath-path="QuestionnaireResponseReview.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default QuestionnaireResponseReview;