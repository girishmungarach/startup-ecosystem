"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Building, MapPin, Clock, AlertCircle, CheckCircle, Save, Send, User } from 'lucide-react';
interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'yes_no';
  options?: string[];
  required?: boolean;
  mpid?: string;
}
interface OpportunityDetails {
  type: string;
  company: string;
  description: string;
  location: string;
  mpid?: string;
}
interface QuestionnaireResponseFormProps {
  opportunityTitle?: string;
  posterName?: string;
  opportunityDetails?: OpportunityDetails;
  questions?: Question[];
  onSubmit?: (answers: Record<string, string>) => void;
  onSaveProgress?: (answers: Record<string, string>) => void;
  onBack?: () => void;
  mpid?: string;
}
const QuestionnaireResponseForm: React.FC<QuestionnaireResponseFormProps> = ({
  opportunityTitle = "Senior Full Stack Developer",
  posterName = "TechFlow Innovations",
  opportunityDetails = {
    type: "Jobs",
    company: "TechFlow Innovations",
    description: "Join our dynamic team building next-generation fintech solutions. We're looking for experienced developers passionate about creating scalable applications.",
    location: "Bangalore, India"
  },
  questions = [{
    id: "1",
    text: "What relevant experience do you have with React and Node.js?",
    type: "text",
    required: true,
    mpid: "9e802a2b-a6e8-4420-927d-129273ebf5f5"
  }, {
    id: "2",
    text: "Are you available for full-time work?",
    type: "yes_no",
    required: true,
    mpid: "0d848b56-cfc6-4e5c-ae4c-7001664f2df6"
  }, {
    id: "3",
    text: "What is your preferred working arrangement?",
    type: "multiple_choice",
    options: ["Remote", "Hybrid", "In-office", "Flexible"],
    required: false,
    mpid: "4ef2271f-3632-465a-8b50-905ca3b138ba"
  }, {
    id: "4",
    text: "Tell us about a challenging project you've worked on recently.",
    type: "text",
    required: false,
    mpid: "e850447f-e7fe-44f4-8c72-76c07a24c5e0"
  }],
  onSubmit,
  onSaveProgress,
  onBack
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    questions.forEach(question => {
      if (question.required && (!answers[question.id] || answers[question.id].trim() === '')) {
        newErrors[question.id] = 'This field is required';
      }
      if (question.type === 'text' && answers[question.id] && answers[question.id].length > 1000) {
        newErrors[question.id] = 'Response must be under 1000 characters';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit?.(answers);
    setShowSuccess(true);
    setIsSubmitting(false);
  };
  const handleSaveProgress = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSaveProgress?.(answers);
    setIsSaving(false);
  };
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Navigate back to opportunities');
    }
  };
  const progress = useMemo(() => {
    const answeredQuestions = questions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length;
    return Math.round(answeredQuestions / questions.length * 100);
  }, [answers, questions]);
  const estimatedTime = Math.max(2, Math.ceil(questions.length * 0.5));
  if (showSuccess) {
    return <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center" data-magicpath-id="0" data-magicpath-path="QuestionnaireResponseForm.tsx">
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="text-center max-w-md mx-auto p-8" data-magicpath-id="1" data-magicpath-path="QuestionnaireResponseForm.tsx">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" data-magicpath-id="2" data-magicpath-path="QuestionnaireResponseForm.tsx">
            <CheckCircle size={32} className="text-green-600" data-magicpath-id="3" data-magicpath-path="QuestionnaireResponseForm.tsx" />
          </div>
          <h2 className="text-3xl font-bold mb-4" data-magicpath-id="4" data-magicpath-path="QuestionnaireResponseForm.tsx">Answers Submitted!</h2>
          <p className="text-gray-600 text-lg mb-6" data-magicpath-id="5" data-magicpath-path="QuestionnaireResponseForm.tsx">
            Your responses have been sent to {posterName}. They'll review your answers and get back to you soon.
          </p>
          <button onClick={handleBack} className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200" data-magicpath-id="6" data-magicpath-path="QuestionnaireResponseForm.tsx">
            Back to Opportunities
          </button>
        </motion.div>
      </div>;
  }
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="7" data-magicpath-path="QuestionnaireResponseForm.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="8" data-magicpath-path="QuestionnaireResponseForm.tsx">
        <div className="max-w-4xl mx-auto" data-magicpath-id="9" data-magicpath-path="QuestionnaireResponseForm.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="10" data-magicpath-path="QuestionnaireResponseForm.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="11" data-magicpath-path="QuestionnaireResponseForm.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Back Navigation */}
          <div className="flex items-center space-x-4 mb-6" data-magicpath-id="12" data-magicpath-path="QuestionnaireResponseForm.tsx">
            <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="13" data-magicpath-path="QuestionnaireResponseForm.tsx">
              <ChevronLeft size={20} data-magicpath-id="14" data-magicpath-path="QuestionnaireResponseForm.tsx" />
              <span className="text-base font-medium" data-magicpath-id="15" data-magicpath-path="QuestionnaireResponseForm.tsx">Back to Opportunities</span>
            </button>
          </div>

          {/* Page Title */}
          <div data-magicpath-id="16" data-magicpath-path="QuestionnaireResponseForm.tsx">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" data-magicpath-id="17" data-magicpath-path="QuestionnaireResponseForm.tsx">
              Answer a few questions about: {opportunityTitle}
            </h2>
            <p className="text-lg font-light text-gray-600" data-magicpath-id="18" data-magicpath-path="QuestionnaireResponseForm.tsx">
              {posterName} would like to know more before sharing contact details
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="19" data-magicpath-path="QuestionnaireResponseForm.tsx">
        <div className="max-w-4xl mx-auto" data-magicpath-id="20" data-magicpath-path="QuestionnaireResponseForm.tsx">
          
          {/* Opportunity Summary Card */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="border-2 border-gray-200 p-6 mb-8" data-magicpath-id="21" data-magicpath-path="QuestionnaireResponseForm.tsx">
            <div className="flex items-start justify-between mb-4" data-magicpath-id="22" data-magicpath-path="QuestionnaireResponseForm.tsx">
              <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(opportunityDetails.type)}`} data-magicpath-id="23" data-magicpath-path="QuestionnaireResponseForm.tsx">
                {opportunityDetails.type}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-3" data-magicpath-id="24" data-magicpath-path="QuestionnaireResponseForm.tsx">{opportunityTitle}</h3>

            <div className="space-y-2 mb-4" data-magicpath-id="25" data-magicpath-path="QuestionnaireResponseForm.tsx">
              <div className="flex items-center space-x-2" data-magicpath-id="26" data-magicpath-path="QuestionnaireResponseForm.tsx">
                <Building size={16} className="text-gray-600" data-magicpath-id="27" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                <span className="text-base font-semibold text-gray-800" data-magicpath-id="28" data-magicpath-path="QuestionnaireResponseForm.tsx">
                  {opportunityDetails.company}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600" data-magicpath-id="29" data-magicpath-path="QuestionnaireResponseForm.tsx">
                <MapPin size={16} data-magicpath-id="30" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                <span className="text-sm" data-magicpath-id="31" data-magicpath-path="QuestionnaireResponseForm.tsx">{opportunityDetails.location}</span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed" data-magicpath-id="32" data-magicpath-path="QuestionnaireResponseForm.tsx">
              {opportunityDetails.description}
            </p>
          </motion.div>

          {/* Progress and Time Estimate */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="flex items-center justify-between mb-8 p-4 bg-gray-50 border-2 border-gray-200" data-magicpath-id="33" data-magicpath-path="QuestionnaireResponseForm.tsx">
            <div className="flex items-center space-x-4" data-magicpath-id="34" data-magicpath-path="QuestionnaireResponseForm.tsx">
              <div className="flex items-center space-x-2" data-magicpath-id="35" data-magicpath-path="QuestionnaireResponseForm.tsx">
                <Clock size={16} className="text-gray-600" data-magicpath-id="36" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                <span className="text-sm text-gray-600" data-magicpath-id="37" data-magicpath-path="QuestionnaireResponseForm.tsx">Takes about {estimatedTime} minutes</span>
              </div>
              <div className="flex items-center space-x-2" data-magicpath-id="38" data-magicpath-path="QuestionnaireResponseForm.tsx">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden" data-magicpath-id="39" data-magicpath-path="QuestionnaireResponseForm.tsx">
                  <motion.div className="h-full bg-black" initial={{
                  width: 0
                }} animate={{
                  width: `${progress}%`
                }} transition={{
                  duration: 0.5
                }} data-magicpath-id="40" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                </div>
                <span className="text-sm text-gray-600" data-magicpath-id="41" data-magicpath-path="QuestionnaireResponseForm.tsx">{progress}% complete</span>
              </div>
            </div>
          </motion.div>

          {/* Questions Form */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="space-y-8" data-magicpath-id="42" data-magicpath-path="QuestionnaireResponseForm.tsx">
            {questions.map((question, index) => <div key={question.id} className="border-2 border-gray-200 p-6" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="43" data-magicpath-path="QuestionnaireResponseForm.tsx">
                <div className="mb-4" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="44" data-magicpath-path="QuestionnaireResponseForm.tsx">
                  <div className="flex items-start space-x-2 mb-2" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="45" data-magicpath-path="QuestionnaireResponseForm.tsx">
                    <span className="text-lg font-bold text-gray-700 mt-1" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="46" data-magicpath-path="QuestionnaireResponseForm.tsx">
                      {index + 1}.
                    </span>
                    <div className="flex-1" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="47" data-magicpath-path="QuestionnaireResponseForm.tsx">
                      <h4 className="text-lg font-semibold leading-relaxed" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-field="text:unknown" data-magicpath-id="48" data-magicpath-path="QuestionnaireResponseForm.tsx">
                        {question.text}
                        {question.required && <span className="text-red-500 ml-1" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="49" data-magicpath-path="QuestionnaireResponseForm.tsx">*</span>}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Text Response */}
                {question.type === 'text' && <div className="space-y-2" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="50" data-magicpath-path="QuestionnaireResponseForm.tsx">
                    <textarea value={answers[question.id] || ''} onChange={e => handleAnswerChange(question.id, e.target.value)} placeholder="Enter your response..." className={`w-full p-4 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 resize-none ${errors[question.id] ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} rows={4} maxLength={1000} data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="51" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                    <div className="flex items-center justify-between" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="52" data-magicpath-path="QuestionnaireResponseForm.tsx">
                      <span className="text-xs text-gray-500" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="53" data-magicpath-path="QuestionnaireResponseForm.tsx">
                        {(answers[question.id] || '').length}/1000 characters
                      </span>
                      {errors[question.id] && <p className="text-red-500 text-sm flex items-center" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="54" data-magicpath-path="QuestionnaireResponseForm.tsx">
                          <AlertCircle size={16} className="mr-1" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="55" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                          {errors[question.id]}
                        </p>}
                    </div>
                  </div>}

                {/* Multiple Choice */}
                {question.type === 'multiple_choice' && <div className="space-y-3" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="56" data-magicpath-path="QuestionnaireResponseForm.tsx">
                    {question.options?.map((option, optionIndex) => <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer group" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="57" data-magicpath-path="QuestionnaireResponseForm.tsx">
                        <input type="radio" name={`question-${question.id}`} value={option} checked={answers[question.id] === option} onChange={e => handleAnswerChange(question.id, e.target.value)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="58" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                        <span className="text-base group-hover:text-gray-600 transition-colors duration-200" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="59" data-magicpath-path="QuestionnaireResponseForm.tsx">
                          {option}
                        </span>
                      </label>)}
                    {errors[question.id] && <p className="text-red-500 text-sm flex items-center mt-2" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="60" data-magicpath-path="QuestionnaireResponseForm.tsx">
                        <AlertCircle size={16} className="mr-1" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="61" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                        {errors[question.id]}
                      </p>}
                  </div>}

                {/* Yes/No */}
                {question.type === 'yes_no' && <div className="space-y-3" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="62" data-magicpath-path="QuestionnaireResponseForm.tsx">
                    {['Yes', 'No'].map(option => <label key={option} className="flex items-center space-x-3 cursor-pointer group" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="63" data-magicpath-path="QuestionnaireResponseForm.tsx">
                        <input type="radio" name={`question-${question.id}`} value={option} checked={answers[question.id] === option} onChange={e => handleAnswerChange(question.id, e.target.value)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="64" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                        <span className="text-base group-hover:text-gray-600 transition-colors duration-200" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="65" data-magicpath-path="QuestionnaireResponseForm.tsx">
                          {option}
                        </span>
                      </label>)}
                    {errors[question.id] && <p className="text-red-500 text-sm flex items-center mt-2" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="66" data-magicpath-path="QuestionnaireResponseForm.tsx">
                        <AlertCircle size={16} className="mr-1" data-magicpath-uuid={(question as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                        {errors[question.id]}
                      </p>}
                  </div>}
              </div>)}
          </motion.div>

          {/* Action Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-12 p-6 bg-gray-50 border-2 border-gray-200" data-magicpath-id="68" data-magicpath-path="QuestionnaireResponseForm.tsx">
            <div className="flex items-center space-x-2 text-gray-700" data-magicpath-id="69" data-magicpath-path="QuestionnaireResponseForm.tsx">
              <User size={20} data-magicpath-id="70" data-magicpath-path="QuestionnaireResponseForm.tsx" />
              <span className="font-medium" data-magicpath-id="71" data-magicpath-path="QuestionnaireResponseForm.tsx">
                {questions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length} of {questions.length} questions answered
              </span>
            </div>

            <div className="flex items-center space-x-3" data-magicpath-id="72" data-magicpath-path="QuestionnaireResponseForm.tsx">
              <button onClick={handleSaveProgress} disabled={isSaving} className="border-2 border-gray-300 text-gray-700 px-6 py-3 text-base font-semibold hover:border-black hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2" data-magicpath-id="73" data-magicpath-path="QuestionnaireResponseForm.tsx">
                <Save size={16} data-magicpath-id="74" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                <span data-magicpath-id="75" data-magicpath-path="QuestionnaireResponseForm.tsx">{isSaving ? 'Saving...' : 'Save Progress'}</span>
              </button>

              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-black text-white px-8 py-3 text-base font-semibold hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2" data-magicpath-id="76" data-magicpath-path="QuestionnaireResponseForm.tsx">
                <Send size={16} data-magicpath-id="77" data-magicpath-path="QuestionnaireResponseForm.tsx" />
                <span data-magicpath-id="78" data-magicpath-path="QuestionnaireResponseForm.tsx">{isSubmitting ? 'Submitting...' : 'Submit Answers'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="79" data-magicpath-path="QuestionnaireResponseForm.tsx">
        <div className="max-w-4xl mx-auto text-center" data-magicpath-id="80" data-magicpath-path="QuestionnaireResponseForm.tsx">
          <p className="text-lg font-light" data-magicpath-id="81" data-magicpath-path="QuestionnaireResponseForm.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default QuestionnaireResponseForm;