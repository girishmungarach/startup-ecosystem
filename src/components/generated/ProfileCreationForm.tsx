"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, ArrowLeft, User, Building, Target, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface FormData {
  fullName: string;
  email: string;
  company: string;
  role: string;
  interests: string[];
  building: string;
  opportunities: string[];
  bio?: string;
  location?: string;
  linkedin_url?: string;
  website_url?: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  role?: string;
  company?: string;
  bio?: string;
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
    opportunities: [],
    bio: '',
    location: '',
    linkedin_url: '',
    website_url: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load existing profile data if available
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setFormData(prev => ({
          ...prev,
          email: user.email || '',
        }));

        if (profile && !error) {
          setFormData({
            fullName: profile.full_name || '',
            email: user.email || '',
            company: profile.company || '',
            role: profile.role || '',
            interests: profile.interests || [],
            building: profile.building || '',
            opportunities: profile.opportunities || [],
            bio: profile.bio || '',
            location: profile.location || '',
            linkedin_url: profile.linkedin_url || '',
            website_url: profile.website_url || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadExistingProfile();
  }, [user]);

  useEffect(() => {
    const checkProfileCompleteAndRedirect = async () => {
      if (!user) return;
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, company, role')
        .eq('id', user.id)
        .single();
      if (profile && profile.full_name && profile.company && profile.role) {
        navigate('/opportunities', { replace: true });
      }
    };
    checkProfileCompleteAndRedirect();
  }, [user, navigate]);

  const roleOptions = [
    { value: 'Founder', description: 'Building and leading startups' },
    { value: 'Investor', description: 'Funding and supporting startups' },
    { value: 'Developer', description: 'Technical development and engineering' },
    { value: 'Designer', description: 'UI/UX and product design' },
    { value: 'Marketing', description: 'Growth and marketing strategies' },
    { value: 'Sales', description: 'Business development and sales' },
    { value: 'Operations', description: 'Business operations and management' },
    { value: 'Student', description: 'Learning and exploring opportunities' },
    { value: 'Other', description: 'Other professional roles' }
  ];

  const interestOptions = [
    'Fintech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'SaaS', 
    'Gaming', 'AgriTech', 'CleanTech', 'Web3', 'Cybersecurity', 'Other'
  ];

  const opportunityOptions = [
    'Jobs', 'Investment', 'Co-founders', 'Mentorship', 'Events', 'Partnerships'
  ];

  // Real-time validation
  const validateField = async (field: keyof FormData, value: string) => {
    setIsValidating(true);
    const newErrors = { ...errors };

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'company':
        if (!value.trim()) {
          newErrors.company = 'Company is required';
        } else {
          delete newErrors.company;
        }
        break;

      case 'bio':
        if (value.length > 500) {
          newErrors.bio = 'Bio must be less than 500 characters';
        } else {
          delete newErrors.bio;
        }
        break;
    }

    setErrors(newErrors);
    setIsValidating(false);
  };

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
      if (!formData.company.trim()) {
        newErrors.company = 'Company is required';
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
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleCheckboxChange = (field: 'interests' | 'opportunities', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async () => {
    if (!user || !validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      setSubmitError(null);
      const upsertData = {
        id: user.id,
        full_name: formData.fullName.trim() || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: formData.email.trim() || user.email,
        company: formData.company.trim() || 'Independent',
        role: formData.role || 'Member',
        interests: formData.interests,
        building: formData.building || '',
        opportunities: formData.opportunities,
        bio: formData.bio,
        location: formData.location,
        linkedin_url: formData.linkedin_url,
        website_url: formData.website_url,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase
        .from('profiles')
        .upsert(upsertData);

      if (error) {
        setSubmitError(error.message || 'Failed to save profile. Please try again.');
        throw error;
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/opportunities');
      }, 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save profile. Please try again.');
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced progress indicator
  const renderProgressIndicator = () => (
    <div className="mb-12">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {[1, 2, 3, 4].map((step) => (
          <motion.div
            key={step}
            className={`flex items-center space-x-2 ${
              currentStep >= step ? 'text-black' : 'text-gray-400'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: step * 0.1 }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep > step 
                ? 'bg-black text-white border-black' 
                : currentStep === step 
                ? 'border-black bg-white text-black' 
                : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {currentStep > step ? <Check size={16} /> : step}
            </div>
            <span className="hidden sm:block font-medium">
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Role & Interests'}
              {step === 3 && 'What You\'re Building'}
              {step === 4 && 'Review & Save'}
            </span>
          </motion.div>
        ))}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-black h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
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
        {errors.fullName && <p className="text-red-500 text-sm mt-2"><AlertCircle className="inline-block mr-1" size={16} /> {errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-lg font-semibold mb-3">
          Email Address *
        </label>
        <input id="email" type="email" value={formData.email} readOnly className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Enter your email address" />
        {errors.email && <p className="text-red-500 text-sm mt-2"><AlertCircle className="inline-block mr-1" size={16} /> {errors.email}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-lg font-semibold mb-3">
          Company/Organization *
        </label>
        <input id="company" type="text" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.company ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Enter your company or organization" />
        {errors.company && <p className="text-red-500 text-sm mt-2"><AlertCircle className="inline-block mr-1" size={16} /> {errors.company}</p>}
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
          {roleOptions.map(role => <option key={role.value} value={role.value}>{role.value} - {role.description}</option>)}
        </select>
        {errors.role && <p className="text-red-500 text-sm mt-2"><AlertCircle className="inline-block mr-1" size={16} /> {errors.role}</p>}
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
  const renderStep3 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Sparkles className="mr-3 text-blue-600" size={28} />
          What are you building?
        </h3>
        <p className="text-gray-600 text-lg mb-8">
          Tell us about your current project, startup, or what you're working on. This helps others understand your focus and potential collaboration opportunities.
        </p>
      </div>

      <div>
        <label htmlFor="building" className="block text-lg font-semibold mb-3">
          What you're building *
        </label>
        <textarea 
          id="building" 
          value={formData.building} 
          onChange={e => handleInputChange('building', e.target.value)} 
          rows={5} 
          className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" 
          placeholder="Tell us about your project, startup, or what you're working on..." 
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-lg font-semibold mb-3">
          Bio (Optional)
        </label>
        <textarea 
          id="bio" 
          value={formData.bio} 
          onChange={e => handleInputChange('bio', e.target.value)} 
          rows={4} 
          className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" 
          placeholder="A brief bio about yourself and your experience..." 
        />
        <div className="flex justify-between items-center mt-2">
          {errors.bio && <p className="text-red-500 text-sm"><AlertCircle className="inline-block mr-1" size={16} /> {errors.bio}</p>}
          <span className="text-gray-500 text-sm">{formData.bio?.length || 0}/500</span>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-lg font-semibold mb-3">
          Location (Optional)
        </label>
        <input 
          id="location" 
          type="text" 
          value={formData.location} 
          onChange={e => handleInputChange('location', e.target.value)} 
          className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" 
          placeholder="City, Country" 
        />
      </div>

      <div>
        <label className="block text-lg font-semibold mb-4">
          What opportunities interest you?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {opportunityOptions.map(opportunity => (
            <label key={opportunity} className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formData.opportunities.includes(opportunity)} 
                onChange={() => handleCheckboxChange('opportunities', opportunity)} 
                className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" 
              />
              <span className="text-base group-hover:text-gray-600 transition-colors duration-200">
                {opportunity}
              </span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Check className="mr-3 text-green-600" size={28} />
          Review & Save
        </h3>
        <p className="text-gray-600 text-lg mb-8">
          Review your profile information before saving. You can always edit this later.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {formData.fullName}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
              <p><span className="font-medium">Company:</span> {formData.company}</p>
              <p><span className="font-medium">Role:</span> {formData.role}</p>
              {formData.location && <p><span className="font-medium">Location:</span> {formData.location}</p>}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Interests & Goals</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Interests:</span> {formData.interests.join(', ') || 'None selected'}</p>
              <p><span className="font-medium">Looking for:</span> {formData.opportunities.join(', ') || 'None selected'}</p>
            </div>
          </div>
        </div>

        {formData.building && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">What you're building</h4>
            <p className="text-sm text-gray-600">{formData.building}</p>
          </div>
        )}

        {formData.bio && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Bio</h4>
            <p className="text-sm text-gray-600">{formData.bio}</p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Check className="text-blue-600" size={16} />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800">Profile will be public</p>
          <p className="text-xs text-blue-600">Other users can discover and connect with you</p>
        </div>
      </div>
    </motion.div>
  );

  // Success state
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-white text-black font-sans flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check size={32} className="text-green-600" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-4"
          >
            Profile Created Successfully!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg mb-6"
          >
            Your profile is now live and discoverable by the startup community.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-2 text-gray-500"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            <span>Redirecting to opportunities...</span>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Back Navigation */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

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
          {currentStep === 4 && renderStep4()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <motion.button 
            onClick={handlePrevious} 
            disabled={currentStep === 1} 
            className={`flex items-center space-x-2 px-6 py-3 text-lg font-semibold transition-all duration-200 ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10'}`}
            whileHover={{ x: currentStep === 1 ? 0 : -2 }}
            whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </motion.button>

          <div className="text-center">
            <span className="text-lg font-light text-gray-600">
              Step {currentStep} of 4
            </span>
          </div>

          {currentStep < 4 ? (
            <motion.button 
              onClick={handleNext} 
              className="flex items-center space-x-2 bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </motion.button>
          ) : (
            <motion.button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-8 py-3 text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 ${
                isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>Save Profile</span>
                  <Check size={20} />
                </>
              )}
            </motion.button>
          )}
        </div>
        {submitError && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle size={20} />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-2 text-sm">{submitError}</p>
          </div>
        )}
      </div>
    </>
  );
};
export default ProfileCreationForm;