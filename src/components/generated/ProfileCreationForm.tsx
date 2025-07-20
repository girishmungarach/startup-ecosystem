"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface FormData {
  fullName: string;
  email: string;
  company: string;
  role: string;
  interests: string[];
  building: string;
  opportunities: string[];
}
interface FormErrors {
  fullName?: string;
  email?: string;
  role?: string;
}
const ProfileCreationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    role: '',
    interests: [],
    building: '',
    opportunities: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const roleOptions = ['Founder', 'Investor', 'Developer', 'Designer', 'Marketing', 'Sales', 'Operations', 'Student', 'Other'];
  const interestOptions = ['Fintech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'SaaS', 'Gaming', 'AgriTech', 'Other'];
  const opportunityOptions = ['Jobs', 'Investment', 'Co-founders', 'Mentorship', 'Events', 'Partnerships'];
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    if (step === 2) {
      if (!formData.role) {
        newErrors.role = 'Please select your role';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  const handleCheckboxChange = (field: 'interests' | 'opportunities', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(item => item !== value) : [...prev[field], value]
    }));
  };
  const handleSubmit = () => {
    console.log('Profile created:', formData);
    // Navigate to opportunities page after profile creation
    navigate('/opportunities');
  };
  const renderProgressIndicator = () => <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map(step => <React.Fragment key={step}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step <= currentStep ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}>
            {step < currentStep ? <Check size={20} /> : <span className="font-semibold">{step}</span>}
          </div>
          {step < 3 && <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-black' : 'bg-gray-300'}`} />}
        </React.Fragment>)}
    </div>;
  const renderStep1 = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} transition={{
    duration: 0.3
  }} className="space-y-8">
      <div>
        <label htmlFor="fullName" className="block text-lg font-semibold mb-3">
          Full Name *
        </label>
        <input id="fullName" type="text" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Enter your full name" />
        {errors.fullName && <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-lg font-semibold mb-3">
          Email Address *
        </label>
        <input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Enter your email address" />
        {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-lg font-semibold mb-3">
          Company/Organization
        </label>
        <input id="company" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" placeholder="Enter your company or organization" />
      </div>
    </motion.div>;
  const renderStep2 = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} transition={{
    duration: 0.3
  }} className="space-y-8">
      <div>
        <label htmlFor="role" className="block text-lg font-semibold mb-3">
          Your Role *
        </label>
        <select id="role" value={formData.role} onChange={e => handleInputChange('role', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.role ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}>
          <option value="">Select your role</option>
          {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
        {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role}</p>}
      </div>

      <div>
        <label className="block text-lg font-semibold mb-4">
          Areas of Interest
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {interestOptions.map(interest => <label key={interest} className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" checked={formData.interests.includes(interest)} onChange={() => handleCheckboxChange('interests', interest)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" />
              <span className="text-base group-hover:text-gray-600 transition-colors duration-200">
                {interest}
              </span>
            </label>)}
        </div>
      </div>
    </motion.div>;
  const renderStep3 = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} transition={{
    duration: 0.3
  }} className="space-y-8">
      <div>
        <label htmlFor="building" className="block text-lg font-semibold mb-3">
          What are you building?
        </label>
        <textarea id="building" value={formData.building} onChange={e => handleInputChange('building', e.target.value)} rows={5} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" placeholder="Tell us about your project, startup, or what you're working on..." />
      </div>

      <div>
        <label className="block text-lg font-semibold mb-4">
          What opportunities interest you?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {opportunityOptions.map(opportunity => <label key={opportunity} className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" checked={formData.opportunities.includes(opportunity)} onChange={() => handleCheckboxChange('opportunities', opportunity)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" />
              <span className="text-base group-hover:text-gray-600 transition-colors duration-200">
                {opportunity}
              </span>
            </label>)}
        </div>
      </div>
    </motion.div>;
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="text-lg font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StartupEcosystem.in
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
              Create Your Profile
            </h2>
            <p className="text-xl md:text-2xl font-light text-center mb-12 max-w-2xl mx-auto">
              Join the premier startup ecosystem and connect with innovators, investors, and talent.
            </p>
          </motion.div>

          {renderProgressIndicator()}

          <div className="bg-white border-2 border-gray-200 p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <button onClick={handlePrevious} disabled={currentStep === 1} className={`flex items-center space-x-2 px-6 py-3 text-lg font-semibold transition-all duration-200 ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10'}`}>
                <ChevronLeft size={20} />
                <span>Previous</span>
              </button>

              <div className="text-center">
                <span className="text-lg font-light text-gray-600">
                  Step {currentStep} of 3
                </span>
              </div>

              {currentStep < 3 ? <button onClick={handleNext} className="flex items-center space-x-2 bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20">
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button> : <button onClick={handleSubmit} className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20">
                  Create Profile
                </button>}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2025 Startup Ecosystem — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default ProfileCreationForm;