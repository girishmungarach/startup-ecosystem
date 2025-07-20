import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield } from 'lucide-react';
const LandingPage: React.FC = () => {
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="0" data-magicpath-path="LandingPage.tsx">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="1" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="LandingPage.tsx">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="3" data-magicpath-path="LandingPage.tsx">
            StartupEcosystem.in
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32" data-magicpath-id="4" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="5" data-magicpath-path="LandingPage.tsx">
          <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} data-magicpath-id="6" data-magicpath-path="LandingPage.tsx">
            Connect. Build.
            <br data-magicpath-id="7" data-magicpath-path="LandingPage.tsx" />
            <span className="block" data-magicpath-id="8" data-magicpath-path="LandingPage.tsx">Scale Together.</span>
          </motion.h2>
          
          <motion.p className="text-xl md:text-2xl lg:text-3xl font-light mb-12 max-w-4xl mx-auto leading-relaxed" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} data-magicpath-id="9" data-magicpath-path="LandingPage.tsx">
            The premier networking platform where startups, investors, and talent converge to create the future.
          </motion.p>
          
          <motion.button className="bg-black text-white px-12 py-6 text-xl md:text-2xl font-semibold hover:bg-gray-900 transition-all duration-300 border-2 border-black hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} data-magicpath-id="10" data-magicpath-path="LandingPage.tsx">
            Jump In
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-24" data-magicpath-id="11" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="12" data-magicpath-path="LandingPage.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16" data-magicpath-id="13" data-magicpath-path="LandingPage.tsx">
            
            {/* Feature 1 */}
            <motion.div className="text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }} data-magicpath-id="14" data-magicpath-path="LandingPage.tsx">
              <div className="mb-8 flex justify-center" data-magicpath-id="15" data-magicpath-path="LandingPage.tsx">
                <Users size={64} className="text-black" strokeWidth={1} data-magicpath-id="16" data-magicpath-path="LandingPage.tsx" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6" data-magicpath-id="17" data-magicpath-path="LandingPage.tsx">
                Post Opportunities
              </h3>
              <p className="text-lg md:text-xl leading-relaxed font-light" data-magicpath-id="18" data-magicpath-path="LandingPage.tsx">
                Share your startup's vision, open positions, and collaboration needs with a curated community of innovators.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div className="text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.8
          }} data-magicpath-id="19" data-magicpath-path="LandingPage.tsx">
              <div className="mb-8 flex justify-center" data-magicpath-id="20" data-magicpath-path="LandingPage.tsx">
                <Search size={64} className="text-black" strokeWidth={1} data-magicpath-id="21" data-magicpath-path="LandingPage.tsx" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6" data-magicpath-id="22" data-magicpath-path="LandingPage.tsx">
                Discover Talent
              </h3>
              <p className="text-lg md:text-xl leading-relaxed font-light" data-magicpath-id="23" data-magicpath-path="LandingPage.tsx">
                Find exceptional founders, developers, designers, and investors who align with your mission and values.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div className="text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 1.0
          }} data-magicpath-id="24" data-magicpath-path="LandingPage.tsx">
              <div className="mb-8 flex justify-center" data-magicpath-id="25" data-magicpath-path="LandingPage.tsx">
                <Shield size={64} className="text-black" strokeWidth={1} data-magicpath-id="26" data-magicpath-path="LandingPage.tsx" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6" data-magicpath-id="27" data-magicpath-path="LandingPage.tsx">
                Privacy First
              </h3>
              <p className="text-lg md:text-xl leading-relaxed font-light" data-magicpath-id="28" data-magicpath-path="LandingPage.tsx">
                Your data, ideas, and connections remain secure with enterprise-grade privacy and selective visibility controls.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black" data-magicpath-id="29" data-magicpath-path="LandingPage.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="30" data-magicpath-path="LandingPage.tsx">
          <p className="text-lg font-light" data-magicpath-id="31" data-magicpath-path="LandingPage.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default LandingPage;