"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Eye, Edit, ArrowRight, Users, MessageSquare } from 'lucide-react';
interface StatusPagesCollectionProps {
  statusType: 'opportunity-grabbed' | 'questionnaire-submitted' | 'pending-reviews';
  opportunityTitle?: string;
  posterName?: string;
  pendingCount?: number;
  canEditResponses?: boolean;
  onBrowseMore?: () => void;
  onEditResponses?: () => void;
  onReviewAll?: () => void;
  mpid?: string;
}
const StatusPagesCollection: React.FC<StatusPagesCollectionProps> = ({
  statusType = 'opportunity-grabbed',
  opportunityTitle = 'Senior Full Stack Developer',
  posterName = 'TechFlow Innovations',
  pendingCount = 5,
  canEditResponses = true,
  onBrowseMore,
  onEditResponses,
  onReviewAll
}) => {
  // Mock data for pending candidates (for poster view)
  const mockCandidates = [{
    id: '1',
    name: 'Priya Sharma',
    title: 'Full Stack Developer',
    experience: '4 years',
    waitingDays: 2,
    hasQuestionnaire: false,
    mpid: "977d7441-0438-4756-b40f-08df2fffa0c5"
  }, {
    id: '2',
    name: 'Rahul Kumar',
    title: 'Senior Developer',
    experience: '6 years',
    waitingDays: 4,
    hasQuestionnaire: true,
    mpid: "30a762f3-fdc0-443f-9beb-d88686060853"
  }, {
    id: '3',
    name: 'Anita Patel',
    title: 'Tech Lead',
    experience: '8 years',
    waitingDays: 1,
    hasQuestionnaire: false,
    mpid: "13ae0fc3-ccc7-4c3c-92fa-3ab4682fda34"
  }] as any[];
  const renderOpportunityGrabbedStatus = () => <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="0" data-magicpath-path="StatusPagesCollection.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="1" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="StatusPagesCollection.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="3" data-magicpath-path="StatusPagesCollection.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="4" data-magicpath-path="StatusPagesCollection.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8" data-magicpath-id="5" data-magicpath-path="StatusPagesCollection.tsx">
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
      <main className="px-6 py-16 md:px-12 lg:px-24" data-magicpath-id="6" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-4xl mx-auto text-center" data-magicpath-id="7" data-magicpath-path="StatusPagesCollection.tsx">
          {/* Success Icon */}
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          duration: 0.5,
          type: "spring"
        }} className="mb-8" data-magicpath-id="8" data-magicpath-path="StatusPagesCollection.tsx">
            <CheckCircle size={80} className="mx-auto text-green-600" data-magicpath-id="9" data-magicpath-path="StatusPagesCollection.tsx" />
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
        }} className="text-4xl md:text-5xl font-bold mb-6" data-magicpath-id="10" data-magicpath-path="StatusPagesCollection.tsx">
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
        }} className="border-2 border-gray-200 p-8 mb-8 text-left" data-magicpath-id="11" data-magicpath-path="StatusPagesCollection.tsx">
            <div className="flex items-start justify-between mb-4" data-magicpath-id="12" data-magicpath-path="StatusPagesCollection.tsx">
              <span className="px-3 py-1 text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200" data-magicpath-id="13" data-magicpath-path="StatusPagesCollection.tsx">
                Jobs
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-3" data-magicpath-id="14" data-magicpath-path="StatusPagesCollection.tsx">{opportunityTitle}</h3>
            <p className="text-lg font-semibold text-gray-800 mb-2" data-magicpath-id="15" data-magicpath-path="StatusPagesCollection.tsx">{posterName}</p>
            <p className="text-gray-600" data-magicpath-id="16" data-magicpath-path="StatusPagesCollection.tsx">Bangalore, India</p>
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
        }} className="mb-8" data-magicpath-id="17" data-magicpath-path="StatusPagesCollection.tsx">
            <p className="text-xl font-light text-gray-700 mb-4" data-magicpath-id="18" data-magicpath-path="StatusPagesCollection.tsx">
              Waiting for <strong data-magicpath-id="19" data-magicpath-path="StatusPagesCollection.tsx">{posterName}</strong> to review your interest
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-600" data-magicpath-id="20" data-magicpath-path="StatusPagesCollection.tsx">
              <Clock size={20} data-magicpath-id="21" data-magicpath-path="StatusPagesCollection.tsx" />
              <span className="text-base" data-magicpath-id="22" data-magicpath-path="StatusPagesCollection.tsx">Most people respond within 2-3 days</span>
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
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" data-magicpath-id="23" data-magicpath-path="StatusPagesCollection.tsx">
            <button onClick={onBrowseMore} className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2" data-magicpath-id="24" data-magicpath-path="StatusPagesCollection.tsx">
              <span data-magicpath-id="25" data-magicpath-path="StatusPagesCollection.tsx">Browse More Opportunities</span>
              <ArrowRight size={20} data-magicpath-id="26" data-magicpath-path="StatusPagesCollection.tsx" />
            </button>
            <button className="text-black border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 flex items-center space-x-2" data-magicpath-id="27" data-magicpath-path="StatusPagesCollection.tsx">
              <Eye size={20} data-magicpath-id="28" data-magicpath-path="StatusPagesCollection.tsx" />
              <span data-magicpath-id="29" data-magicpath-path="StatusPagesCollection.tsx">View Opportunity Details</span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="30" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="31" data-magicpath-path="StatusPagesCollection.tsx">
          <p className="text-lg font-light" data-magicpath-id="32" data-magicpath-path="StatusPagesCollection.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
  const renderQuestionnaireSubmittedStatus = () => <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="33" data-magicpath-path="StatusPagesCollection.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="34" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="35" data-magicpath-path="StatusPagesCollection.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="36" data-magicpath-path="StatusPagesCollection.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="37" data-magicpath-path="StatusPagesCollection.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8" data-magicpath-id="38" data-magicpath-path="StatusPagesCollection.tsx">
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
      <main className="px-6 py-16 md:px-12 lg:px-24" data-magicpath-id="39" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-4xl mx-auto text-center" data-magicpath-id="40" data-magicpath-path="StatusPagesCollection.tsx">
          {/* Success Icon */}
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          duration: 0.5,
          type: "spring"
        }} className="mb-8" data-magicpath-id="41" data-magicpath-path="StatusPagesCollection.tsx">
            <CheckCircle size={80} className="mx-auto text-green-600" data-magicpath-id="42" data-magicpath-path="StatusPagesCollection.tsx" />
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
        }} className="text-4xl md:text-5xl font-bold mb-6" data-magicpath-id="43" data-magicpath-path="StatusPagesCollection.tsx">
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
        }} className="mb-8" data-magicpath-id="44" data-magicpath-path="StatusPagesCollection.tsx">
            <p className="text-xl font-light text-gray-700 mb-4" data-magicpath-id="45" data-magicpath-path="StatusPagesCollection.tsx">
              Waiting for <strong data-magicpath-id="46" data-magicpath-path="StatusPagesCollection.tsx">{posterName}</strong> to review your answers
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-600" data-magicpath-id="47" data-magicpath-path="StatusPagesCollection.tsx">
              <Clock size={20} data-magicpath-id="48" data-magicpath-path="StatusPagesCollection.tsx" />
              <span className="text-base" data-magicpath-id="49" data-magicpath-path="StatusPagesCollection.tsx">Most people respond within 2-3 days</span>
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
        }} className="border-2 border-gray-200 p-8 mb-8 text-left" data-magicpath-id="50" data-magicpath-path="StatusPagesCollection.tsx">
            <h3 className="text-xl font-bold mb-4" data-magicpath-id="51" data-magicpath-path="StatusPagesCollection.tsx">Your Responses Summary</h3>
            <div className="space-y-3 text-gray-700" data-magicpath-id="52" data-magicpath-path="StatusPagesCollection.tsx">
              <div className="flex items-center space-x-2" data-magicpath-id="53" data-magicpath-path="StatusPagesCollection.tsx">
                <MessageSquare size={16} data-magicpath-id="54" data-magicpath-path="StatusPagesCollection.tsx" />
                <span data-magicpath-id="55" data-magicpath-path="StatusPagesCollection.tsx">5 questions answered</span>
              </div>
              <div className="text-sm" data-magicpath-id="56" data-magicpath-path="StatusPagesCollection.tsx">
                <p data-magicpath-id="57" data-magicpath-path="StatusPagesCollection.tsx">• Experience with React and Node.js</p>
                <p data-magicpath-id="58" data-magicpath-path="StatusPagesCollection.tsx">• Previous startup experience</p>
                <p data-magicpath-id="59" data-magicpath-path="StatusPagesCollection.tsx">• Availability and notice period</p>
                <p data-magicpath-id="60" data-magicpath-path="StatusPagesCollection.tsx">• Salary expectations</p>
                <p data-magicpath-id="61" data-magicpath-path="StatusPagesCollection.tsx">• Why you're interested in this role</p>
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
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" data-magicpath-id="62" data-magicpath-path="StatusPagesCollection.tsx">
            {canEditResponses && <button onClick={onEditResponses} className="text-black border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 flex items-center space-x-2" data-magicpath-id="63" data-magicpath-path="StatusPagesCollection.tsx">
                <Edit size={20} data-magicpath-id="64" data-magicpath-path="StatusPagesCollection.tsx" />
                <span data-magicpath-id="65" data-magicpath-path="StatusPagesCollection.tsx">Edit Responses</span>
              </button>}
            <button onClick={onBrowseMore} className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-2" data-magicpath-id="66" data-magicpath-path="StatusPagesCollection.tsx">
              <span data-magicpath-id="67" data-magicpath-path="StatusPagesCollection.tsx">Browse More Opportunities</span>
              <ArrowRight size={20} data-magicpath-id="68" data-magicpath-path="StatusPagesCollection.tsx" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="69" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="70" data-magicpath-path="StatusPagesCollection.tsx">
          <p className="text-lg font-light" data-magicpath-id="71" data-magicpath-path="StatusPagesCollection.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
  const renderPendingReviewsStatus = () => <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="72" data-magicpath-path="StatusPagesCollection.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="73" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="74" data-magicpath-path="StatusPagesCollection.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="75" data-magicpath-path="StatusPagesCollection.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="76" data-magicpath-path="StatusPagesCollection.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap items-center gap-8" data-magicpath-id="77" data-magicpath-path="StatusPagesCollection.tsx">
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
      <main className="px-6 py-16 md:px-12 lg:px-24" data-magicpath-id="78" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-6xl mx-auto" data-magicpath-id="79" data-magicpath-path="StatusPagesCollection.tsx">
          {/* Alert Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="flex items-center justify-center space-x-3 mb-8" data-magicpath-id="80" data-magicpath-path="StatusPagesCollection.tsx">
            <AlertCircle size={40} className="text-orange-500" data-magicpath-id="81" data-magicpath-path="StatusPagesCollection.tsx" />
            <h2 className="text-3xl md:text-4xl font-bold" data-magicpath-id="82" data-magicpath-path="StatusPagesCollection.tsx">
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
        }} className="text-center mb-12" data-magicpath-id="83" data-magicpath-path="StatusPagesCollection.tsx">
            <div className="flex items-center justify-center space-x-2 text-orange-600 mb-4" data-magicpath-id="84" data-magicpath-path="StatusPagesCollection.tsx">
              <Clock size={20} data-magicpath-id="85" data-magicpath-path="StatusPagesCollection.tsx" />
              <span className="text-lg font-medium" data-magicpath-id="86" data-magicpath-path="StatusPagesCollection.tsx">2 people have been waiting 3+ days</span>
            </div>
            <p className="text-gray-600" data-magicpath-id="87" data-magicpath-path="StatusPagesCollection.tsx">Quick responses help maintain engagement and build trust in the community.</p>
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
        }} className="space-y-6 mb-12" data-magicpath-id="88" data-magicpath-path="StatusPagesCollection.tsx">
            {mockCandidates.map((candidate, index) => <motion.div key={candidate.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.4,
            delay: 0.3 + index * 0.1
          }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="89" data-magicpath-path="StatusPagesCollection.tsx">
                <div className="flex items-center justify-between" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="90" data-magicpath-path="StatusPagesCollection.tsx">
                  <div className="flex-1" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="91" data-magicpath-path="StatusPagesCollection.tsx">
                    <div className="flex items-center space-x-4 mb-3" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="92" data-magicpath-path="StatusPagesCollection.tsx">
                      <h3 className="text-xl font-bold" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="93" data-magicpath-path="StatusPagesCollection.tsx">{candidate.name}</h3>
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="94" data-magicpath-path="StatusPagesCollection.tsx">
                        {candidate.title}
                      </span>
                      {candidate.waitingDays >= 3 && <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-field="waitingDays:unknown" data-magicpath-id="95" data-magicpath-path="StatusPagesCollection.tsx">
                          Waiting {candidate.waitingDays} days
                        </span>}
                    </div>
                    <p className="text-gray-600 mb-3" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-field="experience:unknown" data-magicpath-id="96" data-magicpath-path="StatusPagesCollection.tsx">{candidate.experience} experience</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="97" data-magicpath-path="StatusPagesCollection.tsx">
                      <Clock size={14} data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="98" data-magicpath-path="StatusPagesCollection.tsx" />
                      <span data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-field="waitingDays:unknown" data-magicpath-id="99" data-magicpath-path="StatusPagesCollection.tsx">Applied {candidate.waitingDays} days ago</span>
                      {candidate.hasQuestionnaire && <>
                          <span data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="100" data-magicpath-path="StatusPagesCollection.tsx">•</span>
                          <MessageSquare size={14} data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="101" data-magicpath-path="StatusPagesCollection.tsx" />
                          <span data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="102" data-magicpath-path="StatusPagesCollection.tsx">Questionnaire completed</span>
                        </>}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="103" data-magicpath-path="StatusPagesCollection.tsx">
                    <button className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-600 focus:ring-opacity-20" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="104" data-magicpath-path="StatusPagesCollection.tsx">
                      Share Contact
                    </button>
                    {!candidate.hasQuestionnaire && <button className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-20" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="105" data-magicpath-path="StatusPagesCollection.tsx">
                        Send Questionnaire
                      </button>}
                    <button className="text-red-600 border-2 border-red-200 px-4 py-2 text-sm font-semibold hover:border-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-20" data-magicpath-uuid={(candidate as any)["mpid"] ?? "unsafe"} data-magicpath-id="106" data-magicpath-path="StatusPagesCollection.tsx">
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
        }} className="text-center" data-magicpath-id="107" data-magicpath-path="StatusPagesCollection.tsx">
            <button onClick={onReviewAll} className="bg-black text-white px-12 py-4 text-xl font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 flex items-center space-x-3 mx-auto" data-magicpath-id="108" data-magicpath-path="StatusPagesCollection.tsx">
              <Users size={24} data-magicpath-id="109" data-magicpath-path="StatusPagesCollection.tsx" />
              <span data-magicpath-id="110" data-magicpath-path="StatusPagesCollection.tsx">Review All Candidates</span>
              <ArrowRight size={24} data-magicpath-id="111" data-magicpath-path="StatusPagesCollection.tsx" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="112" data-magicpath-path="StatusPagesCollection.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="113" data-magicpath-path="StatusPagesCollection.tsx">
          <p className="text-lg font-light" data-magicpath-id="114" data-magicpath-path="StatusPagesCollection.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
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