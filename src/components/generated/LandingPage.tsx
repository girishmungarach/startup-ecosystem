import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield } from 'lucide-react';
const LandingPage: React.FC = () => {
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            StartupEcosystem.in
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }}>
            Connect. Build.
            <br />
            <span className="block">Scale Together.</span>
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
        }}>
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
        }}>
            Jump In
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            
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
          }}>
              <div className="mb-8 flex justify-center">
                <Users size={64} className="text-black" strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Post Opportunities
              </h3>
              <p className="text-lg md:text-xl leading-relaxed font-light">
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
          }}>
              <div className="mb-8 flex justify-center">
                <Search size={64} className="text-black" strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Discover Talent
              </h3>
              <p className="text-lg md:text-xl leading-relaxed font-light">
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
          }}>
              <div className="mb-8 flex justify-center">
                <Shield size={64} className="text-black" strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Privacy First
              </h3>
              <p className="text-lg md:text-xl leading-relaxed font-light">
                Your data, ideas, and connections remain secure with enterprise-grade privacy and selective visibility controls.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default LandingPage;