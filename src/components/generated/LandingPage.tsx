import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
const LandingPage: React.FC = () => {
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-4 py-6 md:px-8 lg:px-12 xl:px-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight" style={{ fontFamily: 'Abril Fatface, serif', fontWeight: 'normal' }}>
              <span className="block">Startup</span>
              <span className="block">Ecosystem</span>
            </h1>
            <div className="flex items-center space-x-4 md:space-x-6">
              <Link 
                to="/signin"
                className="text-base md:text-lg font-medium text-gray-600 hover:text-black transition-colors duration-200 px-2 py-1"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="bg-black text-white px-4 py-2 md:px-6 md:py-3 text-base md:text-lg font-semibold hover:bg-gray-900 transition-all duration-200 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:px-8 md:py-20 lg:px-12 lg:py-28 xl:px-24 xl:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8 lg:mb-10" initial={{
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
            <span className="block mt-2 md:mt-4">Scale Together.</span>
          </motion.h2>
          
          <motion.p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light mb-8 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed px-4" initial={{
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
          
          <div className="flex justify-center">
            <Link to="/signup">
              <motion.button 
                className="bg-black text-white px-6 py-4 md:px-12 md:py-6 text-lg md:text-xl lg:text-2xl font-semibold hover:bg-gray-900 transition-all duration-300 border-2 border-black hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 rounded-lg min-h-[56px] md:min-h-[64px] flex items-center justify-center" 
                initial={{
                  opacity: 0,
                  y: 20
                }} 
                animate={{
                  opacity: 1,
                  y: 0
                }} 
                transition={{
                  duration: 0.8,
                  delay: 0.4
                }} 
                whileHover={{
                  scale: 1.05
                }} 
                whileTap={{
                  scale: 0.95
                }}
              >
                Jump In
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 md:px-8 md:py-20 lg:px-12 lg:py-24 xl:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            
            {/* Feature 1 */}
            <motion.div className="text-center p-6 md:p-8" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }}>
              <div className="mb-6 md:mb-8 flex justify-center">
                <Users size={48} className="text-black md:w-16 md:h-16" strokeWidth={1} />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
                Post Opportunities
              </h3>
              <p className="text-base md:text-lg lg:text-xl leading-relaxed font-light">
                Share your startup's vision, open positions, and collaboration needs with a curated community of innovators.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div className="text-center p-6 md:p-8" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.8
          }}>
              <div className="mb-6 md:mb-8 flex justify-center">
                <Search size={48} className="text-black md:w-16 md:h-16" strokeWidth={1} />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
                Discover Talent
              </h3>
              <p className="text-base md:text-lg lg:text-xl leading-relaxed font-light">
                Find exceptional founders, developers, designers, and investors who align with your mission and values.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div className="text-center p-6 md:p-8" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 1.0
          }}>
              <div className="mb-6 md:mb-8 flex justify-center">
                <Shield size={48} className="text-black md:w-16 md:h-16" strokeWidth={1} />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
                Privacy First
              </h3>
              <p className="text-base md:text-lg lg:text-xl leading-relaxed font-light">
                Your data, ideas, and connections remain secure with enterprise-grade privacy and selective visibility controls.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 xl:px-24 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-base md:text-lg font-light">
            © 2025 Startup Ecosystem — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default LandingPage;