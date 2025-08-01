"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Eye, Save, Send, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string;
  compensation: string;
  contactPreference: 'direct' | 'review';
  screeningQuestions: string;
}

interface FormErrors {
  title?: string;
  type?: string;
  description?: string;
}

interface PostOpportunityFormProps {
  isEditMode?: boolean;
  opportunityId?: string;
}

const PostOpportunityForm: React.FC<PostOpportunityFormProps> = ({ isEditMode = false, opportunityId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: '',
    location: '',
    description: '',
    requirements: '',
    compensation: '',
    contactPreference: 'direct',
    screeningQuestions: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const opportunityTypes = ['Jobs', 'Investment', 'Co-founder', 'Mentorship', 'Events', 'Partnerships'];

  // Load existing opportunity data if in edit mode
  useEffect(() => {
    const loadOpportunity = async () => {
      if (!isEditMode || !opportunityId || !user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .eq('id', opportunityId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading opportunity:', error);
          setSubmitError('Failed to load opportunity. You may not have permission to edit this opportunity.');
          return;
        }

        if (data) {
          setFormData({
            title: data.title || '',
            type: data.type || '',
            location: data.location || '',
            description: data.description || '',
            requirements: data.requirements || '',
            compensation: data.compensation || '',
            contactPreference: data.contact_preference || 'direct',
            screeningQuestions: data.screening_questions || ''
          });
        }
      } catch (error) {
        console.error('Failed to load opportunity:', error);
        setSubmitError('Failed to load opportunity data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunity();
  }, [isEditMode, opportunityId, user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.type) {
      newErrors.type = 'Please select an opportunity type';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };
  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }
    
    if (!user) {
      console.error('No authenticated user');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // First, ensure user has a profile
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      // If profile doesn't exist, create a default one
      if (profileError && profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            company: 'Your Company',
            role: 'Member',
            interests: [],
            building: '',
            opportunities: [],
          })
          .select('company')
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw new Error('Failed to create user profile');
        }

        profile = newProfile;
      } else if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      const opportunityData = {
        user_id: user.id,
        title: formData.title.trim(),
        type: formData.type.trim(),
        company: (profile?.company || 'Your Company').trim(),
        location: (formData.location && formData.location.trim() !== '' ? formData.location : 'Remote').trim(),
        description: formData.description.trim(),
        requirements: formData.requirements || null,
        compensation: formData.compensation || null,
        contact_email: user.email,
        is_active: !isDraft,
        status: isDraft ? 'draft' : 'active',
        updated_at: new Date().toISOString()
      };

      let result;
      if (isEditMode && opportunityId) {
        // Update existing opportunity
        result = await supabase
          .from('opportunities')
          .update(opportunityData)
          .eq('id', opportunityId)
          .eq('user_id', user.id) // Ensure user owns the opportunity
          .select()
          .single();
      } else {
        // Create new opportunity
        result = await supabase
          .from('opportunities')
          .insert(opportunityData)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving opportunity:', result.error, result);
        setSubmitError(
          (result.error && (result.error.message || result.error.details || JSON.stringify(result.error))) ||
          JSON.stringify(result) ||
          'Failed to save opportunity. Please try again.'
        );
        return;
      }

      console.log('Opportunity saved successfully:', result.data);
      
      setSubmitSuccess(isEditMode ? 'Opportunity updated successfully!' : 'Opportunity posted successfully!');
      
      // Navigate to my opportunities page after a short delay
      setTimeout(() => {
        navigate('/my-opportunities');
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to save opportunity:', error);
      setSubmitError(
        (error && (error.message || error.details || JSON.stringify(error))) ||
        'Failed to save opportunity. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const getTypeColor = (type: string) => {
    const colors = {
      'Jobs': 'bg-blue-100 text-blue-800 border-blue-200',
      'Investment': 'bg-green-100 text-green-800 border-green-200',
      'Co-founder': 'bg-purple-100 text-purple-800 border-purple-200',
      'Mentorship': 'bg-orange-100 text-orange-800 border-orange-200',
      'Events': 'bg-pink-100 text-pink-800 border-pink-200',
      'Partnerships': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  const renderPreview = () => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.3
  }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(formData.type)}`}>
          {formData.type || 'Type'}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3">
        {formData.title || 'Opportunity Title'}
      </h3>

      <div className="space-y-2 mb-4">
        <p className="text-base font-semibold text-gray-800">
          Your Company
        </p>
        <div className="flex items-center text-gray-600">
          <span className="text-sm">
            {formData.location || 'Location'}
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {formData.description || 'Opportunity description will appear here...'}
      </p>

      {formData.requirements && <div className="mb-4">
          <h4 className="font-semibold mb-2">Requirements:</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {formData.requirements}
          </p>
        </div>}

      {formData.compensation && <div className="mb-4">
          <h4 className="font-semibold mb-2">Compensation:</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {formData.compensation}
          </p>
        </div>}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center text-gray-500">
          <span className="text-xs">Posted just now</span>
        </div>
        <button className="bg-black text-white px-4 py-2 text-sm font-semibold">
          Grab It
        </button>
      </div>
    </motion.div>;
  const renderForm = () => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.3
  }} className="space-y-8">
      {/* Basic Information Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
          Basic Information
        </h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold mb-3">
              Title *
            </label>
            <input id="title" type="text" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.title ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="e.g., Senior Full Stack Developer" />
            {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.title}
              </p>}
          </div>

          <div>
            <label htmlFor="type" className="block text-lg font-semibold mb-3">
              Type *
            </label>
            <select id="type" value={formData.type} onChange={e => handleInputChange('type', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.type ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}>
              <option value="">Select opportunity type</option>
              {opportunityTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.type}
              </p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-lg font-semibold mb-3">
              Location
            </label>
            <input id="location" type="text" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" placeholder="e.g., Bangalore, India or Remote" />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-semibold mb-3">
              Description *
            </label>
            <textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={6} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Describe the opportunity, what you're looking for, and what makes it exciting..." />
            {errors.description && <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.description}
              </p>}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
          Details
        </h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="requirements" className="block text-lg font-semibold mb-3">
              Requirements
            </label>
            <textarea id="requirements" value={formData.requirements} onChange={e => handleInputChange('requirements', e.target.value)} rows={4} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" placeholder="List the key requirements, skills, or qualifications needed..." />
          </div>

          <div>
            <label htmlFor="compensation" className="block text-lg font-semibold mb-3">
              Salary/Compensation
            </label>
            <input id="compensation" type="text" value={formData.compensation} onChange={e => handleInputChange('compensation', e.target.value)} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" placeholder="e.g., ₹15-25 LPA, Equity-based, Competitive" />
          </div>
        </div>
      </section>

      {/* Contact Sharing Preferences Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
          Contact Sharing Preferences
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input type="radio" name="contactPreference" value="direct" checked={formData.contactPreference === 'direct'} onChange={e => handleInputChange('contactPreference', e.target.value)} className="w-5 h-5 mt-1 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" />
              <div>
                <span className="text-lg font-semibold group-hover:text-gray-600 transition-colors duration-200">
                  Share my contact directly when someone grabs this
                </span>
                <p className="text-gray-600 text-sm mt-1">
                  Interested people will immediately get your contact information
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <input type="radio" name="contactPreference" value="review" checked={formData.contactPreference === 'review'} onChange={e => handleInputChange('contactPreference', e.target.value)} className="w-5 h-5 mt-1 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" />
              <div>
                <span className="text-lg font-semibold group-hover:text-gray-600 transition-colors duration-200">
                  I'll review each request and decide
                </span>
                <p className="text-gray-600 text-sm mt-1">
                  You'll receive requests and can choose who to share your contact with
                </p>
              </div>
            </label>
          </div>

          <AnimatePresence>
            {formData.contactPreference === 'review' && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }} className="overflow-hidden">
                <div className="pt-4">
                  <label htmlFor="screeningQuestions" className="block text-lg font-semibold mb-3">
                    Screening Questions
                  </label>
                  <textarea id="screeningQuestions" value={formData.screeningQuestions} onChange={e => handleInputChange('screeningQuestions', e.target.value)} rows={4} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" placeholder="What questions would you like to ask interested people?" />
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>;
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg">Loading opportunity...</p>
          </div>
        </div>
      ) : (
        <>
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              {isEditMode ? 'Edit Opportunity' : 'Post an Opportunity'}
            </h2>
            <p className="text-lg md:text-xl font-light text-gray-600 max-w-2xl">
              {isEditMode 
                ? 'Update your opportunity details and republish to the community.'
                : 'Share your opportunity with India\'s most innovative startup community and connect with the right talent.'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Form Section */}
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 md:mb-6">
                <button onClick={() => setIsPreviewMode(false)} className={`px-4 md:px-6 py-3 md:py-3 text-base md:text-lg font-semibold transition-all duration-200 border-2 w-full sm:w-auto min-h-[48px] flex items-center justify-center ${!isPreviewMode ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>
                  Edit
                </button>
                <button onClick={() => setIsPreviewMode(true)} className={`px-4 md:px-6 py-3 md:py-3 text-base md:text-lg font-semibold transition-all duration-200 border-2 flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[48px] ${isPreviewMode ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>
                  <Eye size={18} className="md:w-5 md:h-5" />
                  <span>Preview</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isPreviewMode ? renderPreview() : renderForm()}
              </AnimatePresence>
            </div>

            {/* Action Buttons Section */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-gray-50 border-2 border-gray-200 p-8 space-y-6">
                <h3 className="text-2xl font-bold mb-4">
                  {isEditMode ? 'Ready to update?' : 'Ready to post?'}
                </h3>
                
                {/* Success Display */}
                {submitSuccess && (
                  <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle size={20} />
                      <span className="font-medium">Success</span>
                    </div>
                    <p className="text-green-700 mt-2 text-sm">{submitSuccess}</p>
                  </div>
                )}
                
                {/* Error Display */}
                {submitError && (
                  <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertCircle size={20} />
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="text-red-700 mt-2 text-sm">{submitError}</p>
                    <button 
                      onClick={() => setSubmitError(null)}
                      className="text-red-600 hover:text-red-800 text-sm mt-2 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
                
                <div className="space-y-4">
                  <button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="w-full bg-black text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[56px]">
                    <Send size={20} />
                    <span>{isSubmitting ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Opportunity' : 'Post Opportunity')}</span>
                  </button>

                  <button onClick={() => handleSubmit(true)} disabled={isSubmitting} className="w-full bg-white text-black border-2 border-gray-300 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[56px]">
                    <Save size={20} />
                    <span>Save as Draft</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-300">
                  <h4 className="font-semibold mb-3">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Your opportunity will be reviewed within 24 hours</li>
                    <li>• Once approved, it'll be visible to our community</li>
                    <li>• You'll receive notifications when people show interest</li>
                    <li>• Track engagement through your dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}


    </>
  );
};
export default PostOpportunityForm;