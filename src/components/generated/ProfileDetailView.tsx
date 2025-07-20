"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, User, MapPin, Building, Briefcase, Calendar, Clock, Eye } from 'lucide-react';
interface Profile {
  id: string;
  name: string;
  role: string;
  company: string;
  location?: string;
  joinDate: string;
  profileImage?: string;
  isBookmarked: boolean;
  whatTheyreBuilding: string;
  interests: string[];
  lookingFor: string[];
  lastUpdate: string;
  recentOpportunities: Opportunity[];
}
interface Opportunity {
  id: string;
  title: string;
  type: string;
  postedDate: string;
  description: string;
}
interface ProfileDetailViewProps {
  profile?: Profile;
  onBack?: () => void;
  onBookmark?: (profileId: string) => void;
}
const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({
  profile,
  onBack,
  onBookmark
}) => {
  const [isBookmarked, setIsBookmarked] = useState(profile?.isBookmarked || false);

  // Mock data for demonstration
  const mockProfile: Profile = {
    id: '1',
    name: 'Sarah Chen',
    role: 'Founder',
    company: 'HealthTech Innovations',
    location: 'San Francisco',
    joinDate: 'March 2024',
    isBookmarked: false,
    whatTheyreBuilding: 'Building an AI-powered diagnostic platform for early disease detection. Our platform uses advanced machine learning algorithms to analyze medical imaging data and provide accurate, fast diagnoses for healthcare providers. We\'re currently working with three major hospitals in the Bay Area and have shown 94% accuracy in early-stage cancer detection. The platform integrates seamlessly with existing hospital systems and reduces diagnosis time from days to minutes.',
    interests: ['HealthTech', 'AI/ML', 'Medical Devices', 'Data Analytics'],
    lookingFor: ['Technical Co-founder', 'Series A Investors', 'Healthcare Partnerships', 'Regulatory Advisors'],
    lastUpdate: '3 days ago',
    recentOpportunities: [{
      id: '1',
      title: 'Senior ML Engineer - Healthcare AI',
      type: 'Full-time Position',
      postedDate: '5 days ago',
      description: 'Looking for an experienced ML engineer to join our core team building diagnostic AI systems.'
    }, {
      id: '2',
      title: 'Healthcare Partnership Opportunities',
      type: 'Partnership',
      postedDate: '2 weeks ago',
      description: 'Seeking partnerships with hospitals and medical centers for pilot programs.'
    }]
  };
  const displayProfile = profile || mockProfile;
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(displayProfile.id);
  };
  const handleBackClick = () => {
    onBack?.();
  };
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button onClick={handleBackClick} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 px-4 py-2 -ml-4">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Browse</span>
            </button>
            
            <button onClick={handleBookmarkToggle} className="p-3 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10">
              <Star size={24} className={isBookmarked ? 'fill-black text-black' : 'text-gray-400'} />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            {/* Profile Header */}
            <section className="mb-12">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-8 space-y-6 md:space-y-0">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                    <User size={48} className="text-gray-400" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {displayProfile.name}
                  </h1>
                  
                  <div className="space-y-2 mb-4">
                    <p className="flex items-center space-x-2 text-xl text-gray-600">
                      <Briefcase size={18} />
                      <span>{displayProfile.role} at {displayProfile.company}</span>
                    </p>
                    
                    {displayProfile.location && <p className="flex items-center space-x-2 text-lg text-gray-600">
                        <MapPin size={16} />
                        <span>{displayProfile.location}</span>
                      </p>}
                    
                    <p className="flex items-center space-x-2 text-lg text-gray-600">
                      <Calendar size={16} />
                      <span>Joined {displayProfile.joinDate}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What They're Building */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">
                What they're building
              </h2>
              <div className="bg-gray-50 p-8 border-l-4 border-black">
                <p className="text-lg leading-relaxed text-gray-800">
                  {displayProfile.whatTheyreBuilding}
                </p>
              </div>
            </section>

            {/* Interests/Sectors */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Interests & Sectors</h2>
              <div className="flex flex-wrap gap-3">
                {displayProfile.interests.map((interest, index) => <motion.span key={interest} initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.3,
                delay: index * 0.1
              }} className="px-4 py-2 bg-black text-white font-medium border-2 border-black hover:bg-white hover:text-black transition-all duration-200">
                    {interest}
                  </motion.span>)}
              </div>
            </section>

            {/* Looking For */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Looking for</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayProfile.lookingFor.map((item, index) => <motion.div key={item} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.4,
                delay: index * 0.1
              }} className="flex items-center space-x-3 p-4 border-2 border-gray-200 hover:border-black transition-colors">
                    <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                    <span className="text-lg font-medium">{item}</span>
                  </motion.div>)}
              </div>
            </section>

            {/* Privacy Notice */}
            <section className="mb-12">
              <div className="bg-gray-100 p-6 border-l-4 border-gray-400">
                <div className="flex items-start space-x-3">
                  <Eye size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Privacy Notice</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Contact details are private. Connect through opportunities they post or grab.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              
              {/* Opportunities Posted */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Opportunities posted by {displayProfile.name}
                </h3>
                
                {displayProfile.recentOpportunities.length > 0 ? <div className="space-y-4">
                    {displayProfile.recentOpportunities.map((opportunity, index) => <motion.div key={opportunity.id} initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.4,
                  delay: index * 0.1
                }} className="border-2 border-gray-200 p-6 hover:border-black transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h4 className="text-lg font-semibold">{opportunity.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2 md:mt-0">
                            <span className="px-2 py-1 bg-gray-100 border border-gray-200">
                              {opportunity.type}
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{opportunity.postedDate}</span>
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {opportunity.description}
                        </p>
                      </motion.div>)}
                  </div> : <div className="text-center py-8 text-gray-600">
                    <p className="text-lg">No recent opportunities posted</p>
                  </div>}
              </div>

              {/* Last Update */}
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock size={16} />
                <span>Last profile update: {displayProfile.lastUpdate}</span>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default ProfileDetailView;