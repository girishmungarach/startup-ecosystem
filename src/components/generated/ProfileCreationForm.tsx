"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
interface FormData {
  fullName: string;
  email: string;
  company: string;
  role: string;
  interests: string[];
  building: string;
  opportunities: string[];
  mpid?: string;
}
interface FormErrors {
  fullName?: string;
  email?: string;
  role?: string;
  mpid?: string;
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
    // Handle form submission
  };
  const renderProgressIndicator = () => <div className="flex items-center justify-center mb-12" data-magicpath-id="0" data-magicpath-path="ProfileCreationForm.tsx">
      {[1, 2, 3].map(step => <React.Fragment key={step} data-magicpath-id="1" data-magicpath-path="ProfileCreationForm.tsx">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step <= currentStep ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`} data-magicpath-id="2" data-magicpath-path="ProfileCreationForm.tsx">
            {step < currentStep ? <Check size={20} data-magicpath-id="3" data-magicpath-path="ProfileCreationForm.tsx" /> : <span className="font-semibold" data-magicpath-id="4" data-magicpath-path="ProfileCreationForm.tsx">{step}</span>}
          </div>
          {step < 3 && <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-black' : 'bg-gray-300'}`} data-magicpath-id="5" data-magicpath-path="ProfileCreationForm.tsx" />}
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
  }} className="space-y-8" data-magicpath-id="6" data-magicpath-path="ProfileCreationForm.tsx">
      <div data-magicpath-id="7" data-magicpath-path="ProfileCreationForm.tsx">
        <label htmlFor="fullName" className="block text-lg font-semibold mb-3" data-magicpath-id="8" data-magicpath-path="ProfileCreationForm.tsx">
          Full Name *
        </label>
        <input id="fullName" type="text" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Enter your full name" data-magicpath-id="9" data-magicpath-path="ProfileCreationForm.tsx" />
        {errors.fullName && <p className="text-red-500 text-sm mt-2" data-magicpath-id="10" data-magicpath-path="ProfileCreationForm.tsx">{errors.fullName}</p>}
      </div>

      <div data-magicpath-id="11" data-magicpath-path="ProfileCreationForm.tsx">
        <label htmlFor="email" className="block text-lg font-semibold mb-3" data-magicpath-id="12" data-magicpath-path="ProfileCreationForm.tsx">
          Email Address *
        </label>
        <input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Enter your email address" data-magicpath-id="13" data-magicpath-path="ProfileCreationForm.tsx" />
        {errors.email && <p className="text-red-500 text-sm mt-2" data-magicpath-id="14" data-magicpath-path="ProfileCreationForm.tsx">{errors.email}</p>}
      </div>

      <div data-magicpath-id="15" data-magicpath-path="ProfileCreationForm.tsx">
        <label htmlFor="company" className="block text-lg font-semibold mb-3" data-magicpath-id="16" data-magicpath-path="ProfileCreationForm.tsx">
          Company/Organization
        </label>
        <input id="company" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" placeholder="Enter your company or organization" data-magicpath-id="17" data-magicpath-path="ProfileCreationForm.tsx" />
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
  }} className="space-y-8" data-magicpath-id="18" data-magicpath-path="ProfileCreationForm.tsx">
      <div data-magicpath-id="19" data-magicpath-path="ProfileCreationForm.tsx">
        <label htmlFor="role" className="block text-lg font-semibold mb-3" data-magicpath-id="20" data-magicpath-path="ProfileCreationForm.tsx">
          Your Role *
        </label>
        <select id="role" value={formData.role} onChange={e => handleInputChange('role', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.role ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} data-magicpath-id="21" data-magicpath-path="ProfileCreationForm.tsx">
          <option value="" data-magicpath-id="22" data-magicpath-path="ProfileCreationForm.tsx">Select your role</option>
          {roleOptions.map(role => <option key={role} value={role} data-magicpath-uuid={(role as any)["mpid"] ?? "unsafe"} data-magicpath-id="23" data-magicpath-path="ProfileCreationForm.tsx">{role}</option>)}
        </select>
        {errors.role && <p className="text-red-500 text-sm mt-2" data-magicpath-id="24" data-magicpath-path="ProfileCreationForm.tsx">{errors.role}</p>}
      </div>

      <div data-magicpath-id="25" data-magicpath-path="ProfileCreationForm.tsx">
        <label className="block text-lg font-semibold mb-4" data-magicpath-id="26" data-magicpath-path="ProfileCreationForm.tsx">
          Areas of Interest
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-magicpath-id="27" data-magicpath-path="ProfileCreationForm.tsx">
          {interestOptions.map(interest => <label key={interest} className="flex items-center space-x-3 cursor-pointer group" data-magicpath-uuid={(interest as any)["mpid"] ?? "unsafe"} data-magicpath-id="28" data-magicpath-path="ProfileCreationForm.tsx">
              <input type="checkbox" checked={formData.interests.includes(interest)} onChange={() => handleCheckboxChange('interests', interest)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-uuid={(interest as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="ProfileCreationForm.tsx" />
              <span className="text-base group-hover:text-gray-600 transition-colors duration-200" data-magicpath-uuid={(interest as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="ProfileCreationForm.tsx">
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
  }} className="space-y-8" data-magicpath-id="31" data-magicpath-path="ProfileCreationForm.tsx">
      <div data-magicpath-id="32" data-magicpath-path="ProfileCreationForm.tsx">
        <label htmlFor="building" className="block text-lg font-semibold mb-3" data-magicpath-id="33" data-magicpath-path="ProfileCreationForm.tsx">
          What are you building?
        </label>
        <textarea id="building" value={formData.building} onChange={e => handleInputChange('building', e.target.value)} rows={5} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" placeholder="Tell us about your project, startup, or what you're working on..." data-magicpath-id="34" data-magicpath-path="ProfileCreationForm.tsx" />
      </div>

      <div data-magicpath-id="35" data-magicpath-path="ProfileCreationForm.tsx">
        <label className="block text-lg font-semibold mb-4" data-magicpath-id="36" data-magicpath-path="ProfileCreationForm.tsx">
          What opportunities interest you?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-magicpath-id="37" data-magicpath-path="ProfileCreationForm.tsx">
          {opportunityOptions.map(opportunity => <label key={opportunity} className="flex items-center space-x-3 cursor-pointer group" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="ProfileCreationForm.tsx">
              <input type="checkbox" checked={formData.opportunities.includes(opportunity)} onChange={() => handleCheckboxChange('opportunities', opportunity)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="39" data-magicpath-path="ProfileCreationForm.tsx" />
              <span className="text-base group-hover:text-gray-600 transition-colors duration-200" data-magicpath-uuid={(opportunity as any)["mpid"] ?? "unsafe"} data-magicpath-id="40" data-magicpath-path="ProfileCreationForm.tsx">
                {opportunity}
              </span>
            </label>)}
        </div>
      </div>
    </motion.div>;
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="41" data-magicpath-path="ProfileCreationForm.tsx">
      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="42" data-magicpath-path="ProfileCreationForm.tsx">
        <div className="max-w-4xl mx-auto" data-magicpath-id="43" data-magicpath-path="ProfileCreationForm.tsx">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="44" data-magicpath-path="ProfileCreationForm.tsx">
            StartupEcosystem.in
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="45" data-magicpath-path="ProfileCreationForm.tsx">
        <div className="max-w-4xl mx-auto" data-magicpath-id="46" data-magicpath-path="ProfileCreationForm.tsx">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} data-magicpath-id="47" data-magicpath-path="ProfileCreationForm.tsx">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4" data-magicpath-id="48" data-magicpath-path="ProfileCreationForm.tsx">
              Create Your Profile
            </h2>
            <p className="text-xl md:text-2xl font-light text-center mb-12 max-w-2xl mx-auto" data-magicpath-id="49" data-magicpath-path="ProfileCreationForm.tsx">
              Join the premier startup ecosystem and connect with innovators, investors, and talent.
            </p>
          </motion.div>

          {renderProgressIndicator()}

          <div className="bg-white border-2 border-gray-200 p-8 md:p-12" data-magicpath-id="50" data-magicpath-path="ProfileCreationForm.tsx">
            <AnimatePresence mode="wait" data-magicpath-id="51" data-magicpath-path="ProfileCreationForm.tsx">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200" data-magicpath-id="52" data-magicpath-path="ProfileCreationForm.tsx">
              <button onClick={handlePrevious} disabled={currentStep === 1} className={`flex items-center space-x-2 px-6 py-3 text-lg font-semibold transition-all duration-200 ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10'}`} data-magicpath-id="53" data-magicpath-path="ProfileCreationForm.tsx">
                <ChevronLeft size={20} data-magicpath-id="54" data-magicpath-path="ProfileCreationForm.tsx" />
                <span data-magicpath-id="55" data-magicpath-path="ProfileCreationForm.tsx">Previous</span>
              </button>

              <div className="text-center" data-magicpath-id="56" data-magicpath-path="ProfileCreationForm.tsx">
                <span className="text-lg font-light text-gray-600" data-magicpath-id="57" data-magicpath-path="ProfileCreationForm.tsx">
                  Step {currentStep} of 3
                </span>
              </div>

              {currentStep < 3 ? <button onClick={handleNext} className="flex items-center space-x-2 bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20" data-magicpath-id="58" data-magicpath-path="ProfileCreationForm.tsx">
                  <span data-magicpath-id="59" data-magicpath-path="ProfileCreationForm.tsx">Next</span>
                  <ChevronRight size={20} data-magicpath-id="60" data-magicpath-path="ProfileCreationForm.tsx" />
                </button> : <button onClick={handleSubmit} className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20" data-magicpath-id="61" data-magicpath-path="ProfileCreationForm.tsx">
                  Create Profile
                </button>}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="62" data-magicpath-path="ProfileCreationForm.tsx">
        <div className="max-w-4xl mx-auto text-center" data-magicpath-id="63" data-magicpath-path="ProfileCreationForm.tsx">
          <p className="text-lg font-light" data-magicpath-id="64" data-magicpath-path="ProfileCreationForm.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default ProfileCreationForm;