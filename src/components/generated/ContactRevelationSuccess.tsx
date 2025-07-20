"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, Linkedin, ArrowRight, TrendingUp, Users, MessageCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
interface ContactDetails {
  email: string;
  phone?: string;
  linkedin?: string;
}
interface ContactRevelationSuccessProps {
  userRole: 'grabber' | 'poster';
  posterName?: string;
  grabberName?: string;
  contactDetails?: ContactDetails;
  opportunityTitle?: string;
  opportunityCompany?: string;
  monthlyConnections?: number;
  sharedDetails?: string[];
  onBackToDashboard?: () => void;
  onBackToOpportunities?: () => void;
}
const ContactRevelationSuccess: React.FC<ContactRevelationSuccessProps> = ({
  userRole = 'grabber',
  posterName = 'Sarah Chen',
  grabberName = 'Alex Kumar',
  contactDetails = {
    email: 'sarah.chen@techflow.com',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/sarahchen'
  },
  opportunityTitle = 'Senior Full Stack Developer',
  opportunityCompany = 'TechFlow Innovations',
  monthlyConnections = 12,
  sharedDetails = ['Email', 'Phone', 'LinkedIn'],
  onBackToDashboard,
  onBackToOpportunities
}) => {
  const handleBackAction = () => {
    if (userRole === 'grabber' && onBackToOpportunities) {
      onBackToOpportunities();
    } else if (userRole === 'poster' && onBackToDashboard) {
      onBackToDashboard();
    }
  };
  const renderGrabberView = () => <div className="max-w-4xl mx-auto">
      {/* Success Animation */}
      <motion.div initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.6,
      type: "spring",
      bounce: 0.4
    }} className="text-center mb-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Details Shared!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Great news! <strong>{posterName}</strong> shared their contact details with you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Mail size={24} />
            <span>Contact Information</span>
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200">
              <Mail size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-lg font-semibold">{contactDetails.email}</p>
              </div>
            </div>

            {contactDetails.phone && <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200">
                <Phone size={20} className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Phone</p>
                  <p className="text-lg font-semibold">{contactDetails.phone}</p>
                </div>
              </div>}

            {contactDetails.linkedin && <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200">
                <Linkedin size={20} className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">LinkedIn</p>
                  <p className="text-lg font-semibold">{contactDetails.linkedin}</p>
                </div>
              </div>}
          </div>
        </motion.div>

        {/* Opportunity Reminder */}
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Opportunity Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{opportunityTitle}</h3>
              <p className="text-lg text-gray-600">{opportunityCompany}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="font-semibold text-green-800">You grabbed this opportunity!</span>
                </div>
                <p className="text-sm text-green-700">
                  Now you have direct access to connect with the poster.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.4
    }} className="text-center mt-12">
        <div className="bg-black text-white p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">Reach out and make it happen!</h2>
          <p className="text-xl text-gray-300 mb-6">
            The connection is made. Now it's time to take the next step.
          </p>
          
          {/* Professional Tips */}
          <div className="bg-gray-900 p-6 text-left">
            <h3 className="text-lg font-semibold mb-4">💡 Tips for your first contact:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Reference the specific opportunity you grabbed</li>
              <li>• Mention what excites you about their company</li>
              <li>• Be concise but show genuine interest</li>
              <li>• Suggest a specific next step (call, meeting, etc.)</li>
            </ul>
          </div>
        </div>

        <button onClick={handleBackAction} className="bg-white text-black border-2 border-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all duration-200 flex items-center space-x-2 mx-auto">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </motion.div>
    </div>;
  const renderPosterView = () => <div className="max-w-4xl mx-auto">
      {/* Success Animation */}
      <motion.div initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.6,
      type: "spring",
      bounce: 0.4
    }} className="text-center mb-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Details Shared!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Contact details shared with <strong>{grabberName}</strong>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shared Information Summary */}
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">What Was Shared</h2>
          
          <div className="space-y-4">
            {sharedDetails.map((detail, index) => <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium">{detail}</span>
              </div>)}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle size={20} className="text-blue-600" />
              <span className="font-semibold text-blue-800">Reassurance</span>
            </div>
            <p className="text-sm text-blue-700">
              They can now reach out to you directly. You'll receive their message in your preferred communication channel.
            </p>
          </div>
        </motion.div>

        {/* Connection Analytics */}
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Your Connection Stats</h2>
          
          <div className="space-y-6">
            <div className="text-center p-6 bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users size={24} className="text-gray-600" />
                <span className="text-3xl font-bold">{monthlyConnections}</span>
              </div>
              <p className="text-gray-600 font-medium">Connections this month</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 border border-green-200">
                <TrendingUp size={20} className="text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">78%</p>
                <p className="text-sm text-green-700">Response Rate</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 border border-blue-200">
                <CheckCircle size={20} className="text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">85%</p>
                <p className="text-sm text-blue-700">Success Rate</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">💡 Insight</h3>
              <p className="text-sm text-purple-700">
                Opportunities with detailed descriptions get 3x more quality connections.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Encouragement Section */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.4
    }} className="text-center mt-12">
        <div className="bg-black text-white p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">Great job building connections!</h2>
          <p className="text-xl text-gray-300 mb-6">
            You're actively growing India's startup ecosystem, one connection at a time.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <span>Keep posting quality opportunities to attract the right talent</span>
            <ArrowRight size={20} />
          </div>
        </div>

        <button onClick={handleBackAction} className="bg-white text-black border-2 border-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all duration-200 flex items-center space-x-2 mx-auto">
          <ChevronLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </motion.div>
    </div>;
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StartupEcosystem.in
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 md:px-12 lg:px-24">
        {userRole === 'grabber' ? renderGrabberView() : renderPosterView()}
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
};
export default ContactRevelationSuccess;