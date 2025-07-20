"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Eye, Edit, ArrowRight, Users, MessageSquare, ArrowLeft, Bell } from 'lucide-react';
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
  const renderOpportunityGrabbedStatus = () => (
    <>
      {/* Back Navigation */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

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
        }} className="space-y-4">
          <button onClick={onBrowseMore} className="w-full bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20">
            Browse More Opportunities
          </button>
          
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <Bell size={16} />
              <span className="text-sm">You'll get notified when {posterName} responds</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
  const renderQuestionnaireSubmittedStatus = () => (
    <>
      {/* Back Navigation */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

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
          Questionnaire Submitted!
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
            <span className="px-3 py-1 text-sm font-medium border bg-purple-100 text-purple-800 border-purple-200">
              Questionnaire
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-3">{opportunityTitle}</h3>
          <p className="text-lg font-semibold text-gray-800 mb-2">{posterName}</p>
          <p className="text-gray-600">Your responses have been sent for review</p>
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
            {posterName} will review your responses and get back to you
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Clock size={20} />
            <span className="text-base">Usually takes 1-2 business days</span>
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
        }} className="space-y-4">
          {canEditResponses && (
            <button onClick={onEditResponses} className="w-full bg-white text-black border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10">
              Edit Responses
            </button>
          )}
          
          <button onClick={onBrowseMore} className="w-full bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20">
            Browse More Opportunities
          </button>
        </motion.div>
      </div>
    </>
  );
  const renderPendingReviewsStatus = () => (
    <>
      {/* Back Navigation */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pending Reviews
          </h2>
          <p className="text-xl font-light text-gray-600">
            You have {pendingCount} responses waiting for your review
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border-2 border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{pendingCount}</div>
            <div className="text-gray-600">Pending Reviews</div>
          </div>
          <div className="border-2 border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-gray-600">This Month</div>
          </div>
          <div className="border-2 border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2.3</div>
            <div className="text-gray-600">Avg. Response Time (days)</div>
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
          delay: 0.2
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onReviewAll} className="w-full sm:w-auto bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2">
            <Eye size={20} />
            <span>Review All Responses</span>
          </button>
          
          <button className="w-full sm:w-auto bg-white text-black border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 flex items-center space-x-2">
            <MessageSquare size={20} />
            <span>View Messages</span>
          </button>
        </motion.div>
      </div>
    </>
  );

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