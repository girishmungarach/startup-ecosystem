"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Eye, Edit, ArrowRight, Users, MessageSquare, ArrowLeft } from 'lucide-react';
interface StatusPagesCollectionProps {
  statusType: 'opportunity-grabbed' | 'questionnaire-submitted' | 'pending-reviews';
  opportunityTitle?: string;
  posterName?: string;
  pendingCount?: number;
  canEditResponses?: boolean;
  onBrowseMore?: () => void;
  onEditResponses?: () => void;
  onReviewAll?: () => void;
  onBack?: () => void;
}
const StatusPagesCollection: React.FC<StatusPagesCollectionProps> = ({
  statusType = 'opportunity-grabbed',
  opportunityTitle = 'Senior Full Stack Developer',
  posterName = 'TechFlow Innovations',
  pendingCount = 5,
  canEditResponses = true,
  onBrowseMore,
  onEditResponses,
  onReviewAll,
  onBack
}) => {
  // Mock data for pending candidates (for poster view)
  const mockCandidates = [{
    id: '1',
    name: 'Priya Sharma',
    title: 'Full Stack Developer',
    experience: '4 years',
    waitingDays: 2,
    hasQuestionnaire: false
  }, {
    id: '2',
    name: 'Rahul Kumar',
    title: 'Senior Developer',
    experience: '6 years',
    waitingDays: 4,
    hasQuestionnaire: true
  }, {
    id: '3',
    name: 'Anita Patel',
    title: 'Tech Lead',
    experience: '8 years',
    waitingDays: 1,
    hasQuestionnaire: false
  }] as any[];
  const renderOpportunityGrabbedStatus = () => <div className="min-h-screen bg-white text-black font-sans">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="text-lg font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8">
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
      <main className="px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          duration: 0.5,
          type: "spring"
        }} className="mb-8">
            <CheckCircle size={80} className="mx-auto text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-4xl md:text-5xl font-bold mb-6">
            Interest Sent!
          </motion.h2>

          {/* Opportunity Details */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="border-2 border-gray-200 p-8 mb-8 text-left">
            <div className="flex items-start justify-between mb-4">
              <span className="px-3 py-1 text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                Jobs
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{opportunityTitle}</h3>
            <p className="text-lg font-semibold text-gray-800 mb-2">{posterName}</p>
            <p className="text-gray-600">Bangalore, India</p>
          </motion.div>

          {/* Status Message */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="mb-8">
            <p className="text-xl font-light text-gray-700 mb-4">
              Waiting for <strong>{posterName}</strong> to review your interest
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock size={20} />
              <span className="text-base">Most people respond within 2-3 days</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={onBrowseMore} className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2">
              <span>Browse More Opportunities</span>
              <ArrowRight size={20} />
            </button>
            <button className="text-black border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 flex items-center space-x-2">
              <Eye size={20} />
              <span>View Opportunity Details</span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2025 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
  const renderQuestionnaireSubmittedStatus = () => <div className="min-h-screen bg-white text-black font-sans">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="text-lg font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8">
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
      <main className="px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          duration: 0.5,
          type: "spring"
        }} className="mb-8">
            <CheckCircle size={80} className="mx-auto text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-4xl md:text-5xl font-bold mb-6">
            Responses Submitted!
          </motion.h2>

          {/* Status Message */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="mb-8">
            <p className="text-xl font-light text-gray-700 mb-4">
              Waiting for <strong>{posterName}</strong> to review your answers
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock size={20} />
              <span className="text-base">Most people respond within 2-3 days</span>
            </div>
          </motion.div>

          {/* Questions Summary */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="border-2 border-gray-200 p-8 mb-8 text-left">
            <h3 className="text-xl font-bold mb-4">Your Responses Summary</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} />
                <span>5 questions answered</span>
              </div>
              <div className="text-sm">
                <p>• Experience with React and Node.js</p>
                <p>• Previous startup experience</p>
                <p>• Availability and notice period</p>
                <p>• Salary expectations</p>
                <p>• Why you're interested in this role</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {canEditResponses && <button onClick={onEditResponses} className="text-black border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 flex items-center space-x-2">
                <Edit size={20} />
                <span>Edit Responses</span>
              </button>}
            <button onClick={onBrowseMore} className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2">
              <span>Browse More Opportunities</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2025 Startup Ecosystem — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
  const renderPendingReviewsStatus = () => <div className="min-h-screen bg-white text-black font-sans">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="text-lg font-medium">Back</span>
            </button>
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
      <main className="px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Alert Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="flex items-center justify-center space-x-3 mb-8">
            <AlertCircle size={40} className="text-orange-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              You have {pendingCount} people waiting for your response
            </h2>
          </motion.div>

          {/* Timeline Alert */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 text-orange-600 mb-4">
              <Clock size={20} />
              <span className="text-lg font-medium">2 people have been waiting 3+ days</span>
            </div>
            <p className="text-gray-600">Quick responses help maintain engagement and build trust in the community.</p>
          </motion.div>

          {/* Pending Candidates List */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="space-y-6 mb-12">
            {mockCandidates.map((candidate, index) => <motion.div key={candidate.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.4,
            delay: 0.3 + index * 0.1
          }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-bold">{candidate.name}</h3>
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {candidate.title}
                      </span>
                      {candidate.waitingDays >= 3 && <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          Waiting {candidate.waitingDays} days
                        </span>}
                    </div>
                    <p className="text-gray-600 mb-3">{candidate.experience} experience</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>Applied {candidate.waitingDays} days ago</span>
                      {candidate.hasQuestionnaire && <>
                          <span>•</span>
                          <MessageSquare size={14} />
                          <span>Questionnaire completed</span>
                        </>}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-600 focus:ring-opacity-20">
                      Share Contact
                    </button>
                    {!candidate.hasQuestionnaire && <button className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-20">
                        Send Questionnaire
                      </button>}
                    <button className="text-red-600 border-2 border-red-200 px-4 py-2 text-sm font-semibold hover:border-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20">
                      Decline
                    </button>
                  </div>
                </div>
              </motion.div>)}
          </motion.div>

          {/* Action Button */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6
        }} className="text-center">
            <button onClick={onReviewAll} className="bg-black text-white px-12 py-4 text-xl font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-3 mx-auto">
              <Users size={24} />
              <span>Review All Candidates</span>
              <ArrowRight size={24} />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2025 Startup Ecosystem — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;

  // Render based on status type
  switch (statusType) {
    case 'opportunity-grabbed':
      return renderOpportunityGrabbedStatus();
    case 'questionnaire-submitted':
      return renderQuestionnaireSubmittedStatus();
    case 'pending-reviews':
      return renderPendingReviewsStatus();
    default:
      return renderOpportunityGrabbedStatus();
  }
};
export default StatusPagesCollection;