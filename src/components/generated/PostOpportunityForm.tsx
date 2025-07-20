"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Eye, Save, Send, AlertCircle } from 'lucide-react';
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
const PostOpportunityForm: React.FC = () => {
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
  const opportunityTypes = ['Jobs', 'Investment', 'Co-founder', 'Mentorship', 'Events', 'Partnerships'];
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
  };
  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Opportunity posted:', {
      ...formData,
      isDraft
    });
    setIsSubmitting(false);
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
  }} className="border-2 border-gray-200 p-6 hover:border-black transition-all duration-300" data-magicpath-id="0" data-magicpath-path="PostOpportunityForm.tsx">
      <div className="flex items-start justify-between mb-4" data-magicpath-id="1" data-magicpath-path="PostOpportunityForm.tsx">
        <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(formData.type)}`} data-magicpath-id="2" data-magicpath-path="PostOpportunityForm.tsx">
          {formData.type || 'Type'}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3" data-magicpath-id="3" data-magicpath-path="PostOpportunityForm.tsx">
        {formData.title || 'Opportunity Title'}
      </h3>

      <div className="space-y-2 mb-4" data-magicpath-id="4" data-magicpath-path="PostOpportunityForm.tsx">
        <p className="text-base font-semibold text-gray-800" data-magicpath-id="5" data-magicpath-path="PostOpportunityForm.tsx">
          Your Company
        </p>
        <div className="flex items-center text-gray-600" data-magicpath-id="6" data-magicpath-path="PostOpportunityForm.tsx">
          <span className="text-sm" data-magicpath-id="7" data-magicpath-path="PostOpportunityForm.tsx">
            {formData.location || 'Location'}
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4" data-magicpath-id="8" data-magicpath-path="PostOpportunityForm.tsx">
        {formData.description || 'Opportunity description will appear here...'}
      </p>

      {formData.requirements && <div className="mb-4" data-magicpath-id="9" data-magicpath-path="PostOpportunityForm.tsx">
          <h4 className="font-semibold mb-2" data-magicpath-id="10" data-magicpath-path="PostOpportunityForm.tsx">Requirements:</h4>
          <p className="text-gray-700 text-sm leading-relaxed" data-magicpath-id="11" data-magicpath-path="PostOpportunityForm.tsx">
            {formData.requirements}
          </p>
        </div>}

      {formData.compensation && <div className="mb-4" data-magicpath-id="12" data-magicpath-path="PostOpportunityForm.tsx">
          <h4 className="font-semibold mb-2" data-magicpath-id="13" data-magicpath-path="PostOpportunityForm.tsx">Compensation:</h4>
          <p className="text-gray-700 text-sm leading-relaxed" data-magicpath-id="14" data-magicpath-path="PostOpportunityForm.tsx">
            {formData.compensation}
          </p>
        </div>}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200" data-magicpath-id="15" data-magicpath-path="PostOpportunityForm.tsx">
        <div className="flex items-center text-gray-500" data-magicpath-id="16" data-magicpath-path="PostOpportunityForm.tsx">
          <span className="text-xs" data-magicpath-id="17" data-magicpath-path="PostOpportunityForm.tsx">Posted just now</span>
        </div>
        <button className="bg-black text-white px-4 py-2 text-sm font-semibold" data-magicpath-id="18" data-magicpath-path="PostOpportunityForm.tsx">
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
  }} className="space-y-8" data-magicpath-id="19" data-magicpath-path="PostOpportunityForm.tsx">
      {/* Basic Information Section */}
      <section data-magicpath-id="20" data-magicpath-path="PostOpportunityForm.tsx">
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200" data-magicpath-id="21" data-magicpath-path="PostOpportunityForm.tsx">
          Basic Information
        </h3>
        
        <div className="space-y-6" data-magicpath-id="22" data-magicpath-path="PostOpportunityForm.tsx">
          <div data-magicpath-id="23" data-magicpath-path="PostOpportunityForm.tsx">
            <label htmlFor="title" className="block text-lg font-semibold mb-3" data-magicpath-id="24" data-magicpath-path="PostOpportunityForm.tsx">
              Title *
            </label>
            <input id="title" type="text" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.title ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="e.g., Senior Full Stack Developer" data-magicpath-id="25" data-magicpath-path="PostOpportunityForm.tsx" />
            {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center" data-magicpath-id="26" data-magicpath-path="PostOpportunityForm.tsx">
                <AlertCircle size={16} className="mr-1" data-magicpath-id="27" data-magicpath-path="PostOpportunityForm.tsx" />
                {errors.title}
              </p>}
          </div>

          <div data-magicpath-id="28" data-magicpath-path="PostOpportunityForm.tsx">
            <label htmlFor="type" className="block text-lg font-semibold mb-3" data-magicpath-id="29" data-magicpath-path="PostOpportunityForm.tsx">
              Type *
            </label>
            <select id="type" value={formData.type} onChange={e => handleInputChange('type', e.target.value)} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 ${errors.type ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} data-magicpath-id="30" data-magicpath-path="PostOpportunityForm.tsx">
              <option value="" data-magicpath-id="31" data-magicpath-path="PostOpportunityForm.tsx">Select opportunity type</option>
              {opportunityTypes.map(type => <option key={type} value={type} data-magicpath-id="32" data-magicpath-path="PostOpportunityForm.tsx">{type}</option>)}
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-2 flex items-center" data-magicpath-id="33" data-magicpath-path="PostOpportunityForm.tsx">
                <AlertCircle size={16} className="mr-1" data-magicpath-id="34" data-magicpath-path="PostOpportunityForm.tsx" />
                {errors.type}
              </p>}
          </div>

          <div data-magicpath-id="35" data-magicpath-path="PostOpportunityForm.tsx">
            <label htmlFor="location" className="block text-lg font-semibold mb-3" data-magicpath-id="36" data-magicpath-path="PostOpportunityForm.tsx">
              Location
            </label>
            <input id="location" type="text" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" placeholder="e.g., Bangalore, India or Remote" data-magicpath-id="37" data-magicpath-path="PostOpportunityForm.tsx" />
          </div>

          <div data-magicpath-id="38" data-magicpath-path="PostOpportunityForm.tsx">
            <label htmlFor="description" className="block text-lg font-semibold mb-3" data-magicpath-id="39" data-magicpath-path="PostOpportunityForm.tsx">
              Description *
            </label>
            <textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={6} className={`w-full px-4 py-4 text-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} placeholder="Describe the opportunity, what you're looking for, and what makes it exciting..." data-magicpath-id="40" data-magicpath-path="PostOpportunityForm.tsx" />
            {errors.description && <p className="text-red-500 text-sm mt-2 flex items-center" data-magicpath-id="41" data-magicpath-path="PostOpportunityForm.tsx">
                <AlertCircle size={16} className="mr-1" data-magicpath-id="42" data-magicpath-path="PostOpportunityForm.tsx" />
                {errors.description}
              </p>}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section data-magicpath-id="43" data-magicpath-path="PostOpportunityForm.tsx">
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200" data-magicpath-id="44" data-magicpath-path="PostOpportunityForm.tsx">
          Details
        </h3>
        
        <div className="space-y-6" data-magicpath-id="45" data-magicpath-path="PostOpportunityForm.tsx">
          <div data-magicpath-id="46" data-magicpath-path="PostOpportunityForm.tsx">
            <label htmlFor="requirements" className="block text-lg font-semibold mb-3" data-magicpath-id="47" data-magicpath-path="PostOpportunityForm.tsx">
              Requirements
            </label>
            <textarea id="requirements" value={formData.requirements} onChange={e => handleInputChange('requirements', e.target.value)} rows={4} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" placeholder="List the key requirements, skills, or qualifications needed..." data-magicpath-id="48" data-magicpath-path="PostOpportunityForm.tsx" />
          </div>

          <div data-magicpath-id="49" data-magicpath-path="PostOpportunityForm.tsx">
            <label htmlFor="compensation" className="block text-lg font-semibold mb-3" data-magicpath-id="50" data-magicpath-path="PostOpportunityForm.tsx">
              Salary/Compensation
            </label>
            <input id="compensation" type="text" value={formData.compensation} onChange={e => handleInputChange('compensation', e.target.value)} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200" placeholder="e.g., ₹15-25 LPA, Equity-based, Competitive" data-magicpath-id="51" data-magicpath-path="PostOpportunityForm.tsx" />
          </div>
        </div>
      </section>

      {/* Contact Sharing Preferences Section */}
      <section data-magicpath-id="52" data-magicpath-path="PostOpportunityForm.tsx">
        <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200" data-magicpath-id="53" data-magicpath-path="PostOpportunityForm.tsx">
          Contact Sharing Preferences
        </h3>
        
        <div className="space-y-6" data-magicpath-id="54" data-magicpath-path="PostOpportunityForm.tsx">
          <div className="space-y-4" data-magicpath-id="55" data-magicpath-path="PostOpportunityForm.tsx">
            <label className="flex items-start space-x-3 cursor-pointer group" data-magicpath-id="56" data-magicpath-path="PostOpportunityForm.tsx">
              <input type="radio" name="contactPreference" value="direct" checked={formData.contactPreference === 'direct'} onChange={e => handleInputChange('contactPreference', e.target.value)} className="w-5 h-5 mt-1 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-id="57" data-magicpath-path="PostOpportunityForm.tsx" />
              <div data-magicpath-id="58" data-magicpath-path="PostOpportunityForm.tsx">
                <span className="text-lg font-semibold group-hover:text-gray-600 transition-colors duration-200" data-magicpath-id="59" data-magicpath-path="PostOpportunityForm.tsx">
                  Share my contact directly when someone grabs this
                </span>
                <p className="text-gray-600 text-sm mt-1" data-magicpath-id="60" data-magicpath-path="PostOpportunityForm.tsx">
                  Interested people will immediately get your contact information
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer group" data-magicpath-id="61" data-magicpath-path="PostOpportunityForm.tsx">
              <input type="radio" name="contactPreference" value="review" checked={formData.contactPreference === 'review'} onChange={e => handleInputChange('contactPreference', e.target.value)} className="w-5 h-5 mt-1 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-id="62" data-magicpath-path="PostOpportunityForm.tsx" />
              <div data-magicpath-id="63" data-magicpath-path="PostOpportunityForm.tsx">
                <span className="text-lg font-semibold group-hover:text-gray-600 transition-colors duration-200" data-magicpath-id="64" data-magicpath-path="PostOpportunityForm.tsx">
                  I'll review each request and decide
                </span>
                <p className="text-gray-600 text-sm mt-1" data-magicpath-id="65" data-magicpath-path="PostOpportunityForm.tsx">
                  You'll receive requests and can choose who to share your contact with
                </p>
              </div>
            </label>
          </div>

          <AnimatePresence data-magicpath-id="66" data-magicpath-path="PostOpportunityForm.tsx">
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
          }} className="overflow-hidden" data-magicpath-id="67" data-magicpath-path="PostOpportunityForm.tsx">
                <div className="pt-4" data-magicpath-id="68" data-magicpath-path="PostOpportunityForm.tsx">
                  <label htmlFor="screeningQuestions" className="block text-lg font-semibold mb-3" data-magicpath-id="69" data-magicpath-path="PostOpportunityForm.tsx">
                    Screening Questions
                  </label>
                  <textarea id="screeningQuestions" value={formData.screeningQuestions} onChange={e => handleInputChange('screeningQuestions', e.target.value)} rows={4} className="w-full px-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200 resize-none" placeholder="What questions would you like to ask interested people?" data-magicpath-id="70" data-magicpath-path="PostOpportunityForm.tsx" />
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>;
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="71" data-magicpath-path="PostOpportunityForm.tsx">
      {/* Header */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="72" data-magicpath-path="PostOpportunityForm.tsx">
        <div className="max-w-6xl mx-auto" data-magicpath-id="73" data-magicpath-path="PostOpportunityForm.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="74" data-magicpath-path="PostOpportunityForm.tsx">
            <div className="flex items-center space-x-6" data-magicpath-id="75" data-magicpath-path="PostOpportunityForm.tsx">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="76" data-magicpath-path="PostOpportunityForm.tsx">
                <ChevronLeft size={20} data-magicpath-id="77" data-magicpath-path="PostOpportunityForm.tsx" />
                <span className="text-lg font-medium" data-magicpath-id="78" data-magicpath-path="PostOpportunityForm.tsx">Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="79" data-magicpath-path="PostOpportunityForm.tsx">
              StartupEcosystem.in
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="80" data-magicpath-path="PostOpportunityForm.tsx">
        <div className="max-w-6xl mx-auto" data-magicpath-id="81" data-magicpath-path="PostOpportunityForm.tsx">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="mb-8" data-magicpath-id="82" data-magicpath-path="PostOpportunityForm.tsx">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-magicpath-id="83" data-magicpath-path="PostOpportunityForm.tsx">
              Post an Opportunity
            </h2>
            <p className="text-xl font-light text-gray-600 max-w-2xl" data-magicpath-id="84" data-magicpath-path="PostOpportunityForm.tsx">
              Share your opportunity with India's most innovative startup community and connect with the right talent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-magicpath-id="85" data-magicpath-path="PostOpportunityForm.tsx">
            {/* Form Section */}
            <div className="space-y-8" data-magicpath-id="86" data-magicpath-path="PostOpportunityForm.tsx">
              <div className="flex items-center space-x-4 mb-6" data-magicpath-id="87" data-magicpath-path="PostOpportunityForm.tsx">
                <button onClick={() => setIsPreviewMode(false)} className={`px-6 py-3 text-lg font-semibold transition-all duration-200 border-2 ${!isPreviewMode ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`} data-magicpath-id="88" data-magicpath-path="PostOpportunityForm.tsx">
                  Edit
                </button>
                <button onClick={() => setIsPreviewMode(true)} className={`px-6 py-3 text-lg font-semibold transition-all duration-200 border-2 flex items-center space-x-2 ${isPreviewMode ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`} data-magicpath-id="89" data-magicpath-path="PostOpportunityForm.tsx">
                  <Eye size={20} data-magicpath-id="90" data-magicpath-path="PostOpportunityForm.tsx" />
                  <span data-magicpath-id="91" data-magicpath-path="PostOpportunityForm.tsx">Preview</span>
                </button>
              </div>

              <AnimatePresence mode="wait" data-magicpath-id="92" data-magicpath-path="PostOpportunityForm.tsx">
                {isPreviewMode ? renderPreview() : renderForm()}
              </AnimatePresence>
            </div>

            {/* Action Buttons Section */}
            <div className="lg:sticky lg:top-8 lg:self-start" data-magicpath-id="93" data-magicpath-path="PostOpportunityForm.tsx">
              <div className="bg-gray-50 border-2 border-gray-200 p-8 space-y-6" data-magicpath-id="94" data-magicpath-path="PostOpportunityForm.tsx">
                <h3 className="text-2xl font-bold mb-4" data-magicpath-id="95" data-magicpath-path="PostOpportunityForm.tsx">Ready to post?</h3>
                
                <div className="space-y-4" data-magicpath-id="96" data-magicpath-path="PostOpportunityForm.tsx">
                  <button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="w-full bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2" data-magicpath-id="97" data-magicpath-path="PostOpportunityForm.tsx">
                    <Send size={20} data-magicpath-id="98" data-magicpath-path="PostOpportunityForm.tsx" />
                    <span data-magicpath-id="99" data-magicpath-path="PostOpportunityForm.tsx">{isSubmitting ? 'Posting...' : 'Post Opportunity'}</span>
                  </button>

                  <button onClick={() => handleSubmit(true)} disabled={isSubmitting} className="w-full bg-white text-black border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-black hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2" data-magicpath-id="100" data-magicpath-path="PostOpportunityForm.tsx">
                    <Save size={20} data-magicpath-id="101" data-magicpath-path="PostOpportunityForm.tsx" />
                    <span data-magicpath-id="102" data-magicpath-path="PostOpportunityForm.tsx">Save as Draft</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-300" data-magicpath-id="103" data-magicpath-path="PostOpportunityForm.tsx">
                  <h4 className="font-semibold mb-3" data-magicpath-id="104" data-magicpath-path="PostOpportunityForm.tsx">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-gray-600" data-magicpath-id="105" data-magicpath-path="PostOpportunityForm.tsx">
                    <li data-magicpath-id="106" data-magicpath-path="PostOpportunityForm.tsx">• Your opportunity will be reviewed within 24 hours</li>
                    <li data-magicpath-id="107" data-magicpath-path="PostOpportunityForm.tsx">• Once approved, it'll be visible to our community</li>
                    <li data-magicpath-id="108" data-magicpath-path="PostOpportunityForm.tsx">• You'll receive notifications when people show interest</li>
                    <li data-magicpath-id="109" data-magicpath-path="PostOpportunityForm.tsx">• Track engagement through your dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="110" data-magicpath-path="PostOpportunityForm.tsx">
        <div className="max-w-6xl mx-auto text-center" data-magicpath-id="111" data-magicpath-path="PostOpportunityForm.tsx">
          <p className="text-lg font-light" data-magicpath-id="112" data-magicpath-path="PostOpportunityForm.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default PostOpportunityForm;