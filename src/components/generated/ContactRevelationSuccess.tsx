"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, Linkedin, ArrowRight, TrendingUp, Users, MessageCircle, ChevronLeft } from 'lucide-react';
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
  const renderGrabberView = () => <div className="max-w-4xl mx-auto" data-magicpath-id="0" data-magicpath-path="ContactRevelationSuccess.tsx">
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
    }} className="text-center mb-12" data-magicpath-id="1" data-magicpath-path="ContactRevelationSuccess.tsx">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" data-magicpath-id="2" data-magicpath-path="ContactRevelationSuccess.tsx">
          <CheckCircle size={48} className="text-green-600" data-magicpath-id="3" data-magicpath-path="ContactRevelationSuccess.tsx" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" data-magicpath-id="4" data-magicpath-path="ContactRevelationSuccess.tsx">
          Contact Details Shared!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-magicpath-id="5" data-magicpath-path="ContactRevelationSuccess.tsx">
          Great news! <strong data-magicpath-id="6" data-magicpath-path="ContactRevelationSuccess.tsx">{posterName}</strong> shared their contact details with you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-magicpath-id="7" data-magicpath-path="ContactRevelationSuccess.tsx">
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
      }} className="border-2 border-gray-200 p-8" data-magicpath-id="8" data-magicpath-path="ContactRevelationSuccess.tsx">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" data-magicpath-id="9" data-magicpath-path="ContactRevelationSuccess.tsx">
            <Mail size={24} data-magicpath-id="10" data-magicpath-path="ContactRevelationSuccess.tsx" />
            <span data-magicpath-id="11" data-magicpath-path="ContactRevelationSuccess.tsx">Contact Information</span>
          </h2>
          
          <div className="space-y-6" data-magicpath-id="12" data-magicpath-path="ContactRevelationSuccess.tsx">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200" data-magicpath-id="13" data-magicpath-path="ContactRevelationSuccess.tsx">
              <Mail size={20} className="text-gray-600" data-magicpath-id="14" data-magicpath-path="ContactRevelationSuccess.tsx" />
              <div data-magicpath-id="15" data-magicpath-path="ContactRevelationSuccess.tsx">
                <p className="text-sm text-gray-600 font-medium" data-magicpath-id="16" data-magicpath-path="ContactRevelationSuccess.tsx">Email</p>
                <p className="text-lg font-semibold" data-magicpath-id="17" data-magicpath-path="ContactRevelationSuccess.tsx">{contactDetails.email}</p>
              </div>
            </div>

            {contactDetails.phone && <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200" data-magicpath-id="18" data-magicpath-path="ContactRevelationSuccess.tsx">
                <Phone size={20} className="text-gray-600" data-magicpath-id="19" data-magicpath-path="ContactRevelationSuccess.tsx" />
                <div data-magicpath-id="20" data-magicpath-path="ContactRevelationSuccess.tsx">
                  <p className="text-sm text-gray-600 font-medium" data-magicpath-id="21" data-magicpath-path="ContactRevelationSuccess.tsx">Phone</p>
                  <p className="text-lg font-semibold" data-magicpath-id="22" data-magicpath-path="ContactRevelationSuccess.tsx">{contactDetails.phone}</p>
                </div>
              </div>}

            {contactDetails.linkedin && <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200" data-magicpath-id="23" data-magicpath-path="ContactRevelationSuccess.tsx">
                <Linkedin size={20} className="text-gray-600" data-magicpath-id="24" data-magicpath-path="ContactRevelationSuccess.tsx" />
                <div data-magicpath-id="25" data-magicpath-path="ContactRevelationSuccess.tsx">
                  <p className="text-sm text-gray-600 font-medium" data-magicpath-id="26" data-magicpath-path="ContactRevelationSuccess.tsx">LinkedIn</p>
                  <p className="text-lg font-semibold" data-magicpath-id="27" data-magicpath-path="ContactRevelationSuccess.tsx">{contactDetails.linkedin}</p>
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
      }} className="border-2 border-gray-200 p-8" data-magicpath-id="28" data-magicpath-path="ContactRevelationSuccess.tsx">
          <h2 className="text-2xl font-bold mb-6" data-magicpath-id="29" data-magicpath-path="ContactRevelationSuccess.tsx">Opportunity Details</h2>
          
          <div className="space-y-4" data-magicpath-id="30" data-magicpath-path="ContactRevelationSuccess.tsx">
            <div data-magicpath-id="31" data-magicpath-path="ContactRevelationSuccess.tsx">
              <h3 className="text-xl font-bold" data-magicpath-id="32" data-magicpath-path="ContactRevelationSuccess.tsx">{opportunityTitle}</h3>
              <p className="text-lg text-gray-600" data-magicpath-id="33" data-magicpath-path="ContactRevelationSuccess.tsx">{opportunityCompany}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200" data-magicpath-id="34" data-magicpath-path="ContactRevelationSuccess.tsx">
              <div className="bg-green-50 border border-green-200 p-4" data-magicpath-id="35" data-magicpath-path="ContactRevelationSuccess.tsx">
                <div className="flex items-center space-x-2 mb-2" data-magicpath-id="36" data-magicpath-path="ContactRevelationSuccess.tsx">
                  <CheckCircle size={20} className="text-green-600" data-magicpath-id="37" data-magicpath-path="ContactRevelationSuccess.tsx" />
                  <span className="font-semibold text-green-800" data-magicpath-id="38" data-magicpath-path="ContactRevelationSuccess.tsx">You grabbed this opportunity!</span>
                </div>
                <p className="text-sm text-green-700" data-magicpath-id="39" data-magicpath-path="ContactRevelationSuccess.tsx">
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
    }} className="text-center mt-12" data-magicpath-id="40" data-magicpath-path="ContactRevelationSuccess.tsx">
        <div className="bg-black text-white p-8 mb-8" data-magicpath-id="41" data-magicpath-path="ContactRevelationSuccess.tsx">
          <h2 className="text-3xl font-bold mb-4" data-magicpath-id="42" data-magicpath-path="ContactRevelationSuccess.tsx">Reach out and make it happen!</h2>
          <p className="text-xl text-gray-300 mb-6" data-magicpath-id="43" data-magicpath-path="ContactRevelationSuccess.tsx">
            The connection is made. Now it's time to take the next step.
          </p>
          
          {/* Professional Tips */}
          <div className="bg-gray-900 p-6 text-left" data-magicpath-id="44" data-magicpath-path="ContactRevelationSuccess.tsx">
            <h3 className="text-lg font-semibold mb-4" data-magicpath-id="45" data-magicpath-path="ContactRevelationSuccess.tsx">💡 Tips for your first contact:</h3>
            <ul className="space-y-2 text-gray-300" data-magicpath-id="46" data-magicpath-path="ContactRevelationSuccess.tsx">
              <li data-magicpath-id="47" data-magicpath-path="ContactRevelationSuccess.tsx">• Reference the specific opportunity you grabbed</li>
              <li data-magicpath-id="48" data-magicpath-path="ContactRevelationSuccess.tsx">• Mention what excites you about their company</li>
              <li data-magicpath-id="49" data-magicpath-path="ContactRevelationSuccess.tsx">• Be concise but show genuine interest</li>
              <li data-magicpath-id="50" data-magicpath-path="ContactRevelationSuccess.tsx">• Suggest a specific next step (call, meeting, etc.)</li>
            </ul>
          </div>
        </div>

        <button onClick={handleBackAction} className="bg-white text-black border-2 border-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all duration-200 flex items-center space-x-2 mx-auto" data-magicpath-id="51" data-magicpath-path="ContactRevelationSuccess.tsx">
          <ChevronLeft size={20} data-magicpath-id="52" data-magicpath-path="ContactRevelationSuccess.tsx" />
          <span data-magicpath-id="53" data-magicpath-path="ContactRevelationSuccess.tsx">Back to Opportunities</span>
        </button>
      </motion.div>
    </div>;
  const renderPosterView = () => <div className="max-w-4xl mx-auto" data-magicpath-id="54" data-magicpath-path="ContactRevelationSuccess.tsx">
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
    }} className="text-center mb-12" data-magicpath-id="55" data-magicpath-path="ContactRevelationSuccess.tsx">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" data-magicpath-id="56" data-magicpath-path="ContactRevelationSuccess.tsx">
          <CheckCircle size={48} className="text-green-600" data-magicpath-id="57" data-magicpath-path="ContactRevelationSuccess.tsx" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" data-magicpath-id="58" data-magicpath-path="ContactRevelationSuccess.tsx">
          Contact Details Shared!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-magicpath-id="59" data-magicpath-path="ContactRevelationSuccess.tsx">
          Contact details shared with <strong data-magicpath-id="60" data-magicpath-path="ContactRevelationSuccess.tsx">{grabberName}</strong>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-magicpath-id="61" data-magicpath-path="ContactRevelationSuccess.tsx">
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
      }} className="border-2 border-gray-200 p-8" data-magicpath-id="62" data-magicpath-path="ContactRevelationSuccess.tsx">
          <h2 className="text-2xl font-bold mb-6" data-magicpath-id="63" data-magicpath-path="ContactRevelationSuccess.tsx">What Was Shared</h2>
          
          <div className="space-y-4" data-magicpath-id="64" data-magicpath-path="ContactRevelationSuccess.tsx">
            {sharedDetails.map((detail, index) => <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200" data-magicpath-id="65" data-magicpath-path="ContactRevelationSuccess.tsx">
                <CheckCircle size={16} className="text-green-600" data-magicpath-id="66" data-magicpath-path="ContactRevelationSuccess.tsx" />
                <span className="font-medium" data-magicpath-id="67" data-magicpath-path="ContactRevelationSuccess.tsx">{detail}</span>
              </div>)}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200" data-magicpath-id="68" data-magicpath-path="ContactRevelationSuccess.tsx">
            <div className="flex items-center space-x-2 mb-2" data-magicpath-id="69" data-magicpath-path="ContactRevelationSuccess.tsx">
              <MessageCircle size={20} className="text-blue-600" data-magicpath-id="70" data-magicpath-path="ContactRevelationSuccess.tsx" />
              <span className="font-semibold text-blue-800" data-magicpath-id="71" data-magicpath-path="ContactRevelationSuccess.tsx">Reassurance</span>
            </div>
            <p className="text-sm text-blue-700" data-magicpath-id="72" data-magicpath-path="ContactRevelationSuccess.tsx">
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
      }} className="border-2 border-gray-200 p-8" data-magicpath-id="73" data-magicpath-path="ContactRevelationSuccess.tsx">
          <h2 className="text-2xl font-bold mb-6" data-magicpath-id="74" data-magicpath-path="ContactRevelationSuccess.tsx">Your Connection Stats</h2>
          
          <div className="space-y-6" data-magicpath-id="75" data-magicpath-path="ContactRevelationSuccess.tsx">
            <div className="text-center p-6 bg-gray-50 border border-gray-200" data-magicpath-id="76" data-magicpath-path="ContactRevelationSuccess.tsx">
              <div className="flex items-center justify-center space-x-2 mb-2" data-magicpath-id="77" data-magicpath-path="ContactRevelationSuccess.tsx">
                <Users size={24} className="text-gray-600" data-magicpath-id="78" data-magicpath-path="ContactRevelationSuccess.tsx" />
                <span className="text-3xl font-bold" data-magicpath-id="79" data-magicpath-path="ContactRevelationSuccess.tsx">{monthlyConnections}</span>
              </div>
              <p className="text-gray-600 font-medium" data-magicpath-id="80" data-magicpath-path="ContactRevelationSuccess.tsx">Connections this month</p>
            </div>

            <div className="grid grid-cols-2 gap-4" data-magicpath-id="81" data-magicpath-path="ContactRevelationSuccess.tsx">
              <div className="text-center p-4 bg-green-50 border border-green-200" data-magicpath-id="82" data-magicpath-path="ContactRevelationSuccess.tsx">
                <TrendingUp size={20} className="text-green-600 mx-auto mb-2" data-magicpath-id="83" data-magicpath-path="ContactRevelationSuccess.tsx" />
                <p className="text-2xl font-bold text-green-800" data-magicpath-id="84" data-magicpath-path="ContactRevelationSuccess.tsx">78%</p>
                <p className="text-sm text-green-700" data-magicpath-id="85" data-magicpath-path="ContactRevelationSuccess.tsx">Response Rate</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 border border-blue-200" data-magicpath-id="86" data-magicpath-path="ContactRevelationSuccess.tsx">
                <CheckCircle size={20} className="text-blue-600 mx-auto mb-2" data-magicpath-id="87" data-magicpath-path="ContactRevelationSuccess.tsx" />
                <p className="text-2xl font-bold text-blue-800" data-magicpath-id="88" data-magicpath-path="ContactRevelationSuccess.tsx">85%</p>
                <p className="text-sm text-blue-700" data-magicpath-id="89" data-magicpath-path="ContactRevelationSuccess.tsx">Success Rate</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200" data-magicpath-id="90" data-magicpath-path="ContactRevelationSuccess.tsx">
              <h3 className="font-semibold text-purple-800 mb-2" data-magicpath-id="91" data-magicpath-path="ContactRevelationSuccess.tsx">💡 Insight</h3>
              <p className="text-sm text-purple-700" data-magicpath-id="92" data-magicpath-path="ContactRevelationSuccess.tsx">
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
    }} className="text-center mt-12" data-magicpath-id="93" data-magicpath-path="ContactRevelationSuccess.tsx">
        <div className="bg-black text-white p-8 mb-8" data-magicpath-id="94" data-magicpath-path="ContactRevelationSuccess.tsx">
          <h2 className="text-3xl font-bold mb-4" data-magicpath-id="95" data-magicpath-path="ContactRevelationSuccess.tsx">Great job building connections!</h2>
          <p className="text-xl text-gray-300 mb-6" data-magicpath-id="96" data-magicpath-path="ContactRevelationSuccess.tsx">
            You're actively growing India's startup ecosystem, one connection at a time.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-300" data-magicpath-id="97" data-magicpath-path="ContactRevelationSuccess.tsx">
            <span data-magicpath-id="98" data-magicpath-path="ContactRevelationSuccess.tsx">Keep posting quality opportunities to attract the right talent</span>
            <ArrowRight size={20} data-magicpath-id="99" data-magicpath-path="ContactRevelationSuccess.tsx" />
          </div>
        </div>

        <button onClick={handleBackAction} className="bg-white text-black border-2 border-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all duration-200 flex items-center space-x-2 mx-auto" data-magicpath-id="100" data-magicpath-path="ContactRevelationSuccess.tsx">
          <ChevronLeft size={20} data-magicpath-id="101" data-magicpath-path="ContactRevelationSuccess.tsx" />
          <span data-magicpath-id="102" data-magicpath-path="ContactRevelationSuccess.tsx">Back to Dashboard</span>
        </button>
      </motion.div>
    </div>;
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="103" data-magicpath-path="ContactRevelationSuccess.tsx">
      {/* Header */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="104" data-magicpath-path="ContactRevelationSuccess.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="105" data-magicpath-path="ContactRevelationSuccess.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="106" data-magicpath-path="ContactRevelationSuccess.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="107" data-magicpath-path="ContactRevelationSuccess.tsx">
              StartupEcosystem.in
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 md:px-12 lg:px-24" data-magicpath-id="108" data-magicpath-path="ContactRevelationSuccess.tsx">
        {userRole === 'grabber' ? renderGrabberView() : renderPosterView()}
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="109" data-magicpath-path="ContactRevelationSuccess.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="110" data-magicpath-path="ContactRevelationSuccess.tsx">
          <p className="text-lg font-light" data-magicpath-id="111" data-magicpath-path="ContactRevelationSuccess.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default ContactRevelationSuccess;