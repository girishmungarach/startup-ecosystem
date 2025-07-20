"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Eye, Edit, ArrowRight, Users, MessageSquare, ArrowLeft, Bell, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);

  // Auto-refresh for pending reviews
  useEffect(() => {
    if (statusType === 'pending-reviews') {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [statusType]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };
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
          <motion.button 
            onClick={onBrowseMore} 
            className="w-full bg-black text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center justify-center space-x-2 min-h-[56px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRight size={20} />
            <span>Browse More Opportunities</span>
          </motion.button>
          
          <motion.button 
            className="w-full bg-white text-black border-2 border-gray-300 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 flex items-center justify-center space-x-2 min-h-[56px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users size={20} />
            <span>View My Applications</span>
          </motion.button>
          
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

        {/* Real-time Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Bell size={16} className="text-blue-600" />
                <span className="text-blue-800">Data updated automatically</span>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-blue-600 hover:text-blue-800">
                <AlertCircle size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
        }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="border-2 border-gray-200 p-6 text-center hover:border-orange-300 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl font-bold text-orange-600 mb-2">{pendingCount}</div>
            <div className="text-gray-600">Pending Reviews</div>
            <div className="text-xs text-gray-500 mt-2">Requires attention</div>
          </motion.div>
          <motion.div 
            className="border-2 border-gray-200 p-6 text-center hover:border-green-300 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-gray-600">This Month</div>
            <div className="text-xs text-gray-500 mt-2 flex items-center justify-center">
              <TrendingUp size={12} className="mr-1" />
              +15% from last month
            </div>
          </motion.div>
          <motion.div 
            className="border-2 border-gray-200 p-6 text-center hover:border-blue-300 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">2.3</div>
            <div className="text-gray-600">Avg. Response Time (days)</div>
            <div className="text-xs text-gray-500 mt-2 flex items-center justify-center">
              <Calendar size={12} className="mr-1" />
              Faster than average
            </div>
          </motion.div>
        </motion.div>

        {/* Last Updated */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <RefreshCw 
              size={14} 
              className={`${isRefreshing ? 'animate-spin' : ''} cursor-pointer hover:text-gray-700`}
              onClick={handleRefresh}
            />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
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
          delay: 0.3
        }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <motion.button 
            onClick={onReviewAll} 
            className="w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center justify-center space-x-2 min-h-[56px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={20} />
            <span>Review All Responses</span>
          </motion.button>
          
          <motion.button 
            className="w-full sm:w-auto bg-white text-black border-2 border-gray-300 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 flex items-center justify-center space-x-2 min-h-[56px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageSquare size={20} />
            <span>View Messages</span>
          </motion.button>
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