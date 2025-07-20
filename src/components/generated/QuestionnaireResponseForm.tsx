"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Building, MapPin, Clock, AlertCircle, CheckCircle, Save, Send, User, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'yes_no';
  options?: string[];
  required?: boolean;
}
interface OpportunityDetails {
  type: string;
  company: string;
  description: string;
  location: string;
}
interface QuestionnaireResponseFormProps {
  opportunityTitle?: string;
  posterName?: string;
  opportunityDetails?: OpportunityDetails;
  questions?: Question[];
  onSubmit?: (answers: Record<string, string>) => void;
  onSaveProgress?: (answers: Record<string, string>) => void;
  onBack?: () => void;
}
const QuestionnaireResponseForm: React.FC<QuestionnaireResponseFormProps> = () => {
  const { questionnaireId } = useParams<{ questionnaireId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [opportunityId, setOpportunityId] = useState<string | null>(null);
  const [opportunityTitle, setOpportunityTitle] = useState("Loading...");
  const [posterName, setPosterName] = useState("Loading...");
  const [opportunityDetails, setOpportunityDetails] = useState({
    type: "Jobs",
    company: "Loading...",
    description: "Loading...",
    location: "Loading..."
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load questionnaire data
  useEffect(() => {
    const loadQuestionnaire = async () => {
      if (!questionnaireId || !user) return;

      try {
        setLoading(true);
        setError(null);

        // Load questionnaire with opportunity details
        const { data: questionnaire, error: questionnaireError } = await supabase
          .from('questionnaires')
          .select(`
            *,
            opportunities (
              id,
              title,
              type,
              company,
              description,
              location,
              profiles!opportunities_user_id_fkey (
                full_name
              )
            )
          `)
          .eq('id', questionnaireId)
          .single();

        if (questionnaireError) {
          console.error('Error loading questionnaire:', questionnaireError);
          setError('Failed to load questionnaire');
          return;
        }

        if (!questionnaire) {
          setError('Questionnaire not found');
          return;
        }

        // Set opportunity details
        setOpportunityId(questionnaire.opportunities?.id || null);
        setOpportunityTitle(questionnaire.opportunities?.title || 'Unknown Opportunity');
        setPosterName(questionnaire.opportunities?.profiles?.full_name || 'Unknown Poster');
        setOpportunityDetails({
          type: questionnaire.opportunities?.type || 'Jobs',
          company: questionnaire.opportunities?.company || 'Unknown Company',
          description: questionnaire.opportunities?.description || 'No description available',
          location: questionnaire.opportunities?.location || 'Unknown Location'
        });

        // Set questions
        const questionsData = questionnaire.questions || [];
        setQuestions(questionsData);

        // Load existing response if any
        const { data: existingResponse } = await supabase
          .from('questionnaire_responses')
          .select('responses')
          .eq('questionnaire_id', questionnaireId)
          .eq('user_id', user.id)
          .single();

        if (existingResponse?.responses) {
          setAnswers(existingResponse.responses);
        }

      } catch (err) {
        console.error('Error loading questionnaire:', err);
        setError('Failed to load questionnaire');
      } finally {
        setLoading(false);
      }
    };

    loadQuestionnaire();
  }, [questionnaireId, user]);
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
    if (!validateForm() || !user || !questionnaireId) return;
    setIsSubmitting(true);

    try {
      // Save response to database
      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert({
          questionnaire_id: questionnaireId,
          user_id: user.id,
          responses: answers,
          is_complete: true,
          submitted_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error submitting questionnaire:', error);
        throw error;
      }

      // Update opportunity grab status
      const { error: grabError } = await supabase
        .from('opportunity_grabs')
        .update({ 
          status: 'questionnaire_completed',
          updated_at: new Date().toISOString()
        })
        .eq('opportunity_id', opportunityId)
        .eq('user_id', user.id);

      if (grabError) {
        console.error('Error updating opportunity grab:', grabError);
      }

      setShowSuccess(true);
    } catch (err) {
      console.error('Failed to submit questionnaire:', err);
      setError('Failed to submit questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSaveProgress = async () => {
    if (!user || !questionnaireId) return;
    setIsSaving(true);

    try {
      // Save draft response to database
      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert({
          questionnaire_id: questionnaireId,
          user_id: user.id,
          responses: answers,
          is_complete: false,
          submitted_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving progress:', error);
        throw error;
      }

      console.log('Progress saved successfully');
    } catch (err) {
      console.error('Failed to save progress:', err);
      setError('Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  const handleBack = () => {
    navigate('/opportunities');
  };
  const progress = useMemo(() => {
    const answeredQuestions = questions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length;
    return Math.round(answeredQuestions / questions.length * 100);
  }, [answers, questions]);
  const estimatedTime = Math.max(2, Math.ceil(questions.length * 0.5));
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Error Loading Questionnaire</h2>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <button onClick={handleBack} className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200">
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Answers Submitted!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Your responses have been sent to {posterName}. They'll review your answers and get back to you soon.
          </p>
          <button onClick={handleBack} className="bg-black text-white px-8 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200">
            Back to Opportunities
          </button>
        </motion.div>
      </div>;
  }
  return (
    <>
      {/* Back Navigation and Page Title */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200">
            <ArrowLeft size={20} />
            <span className="text-base font-medium">Back</span>
          </button>
        </div>

        {/* Page Title */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Answer a few questions about: {opportunityTitle}
          </h2>
          <p className="text-lg font-light text-gray-600">
            {posterName} would like to know more before sharing contact details
          </p>
        </div>
      </div>

      {/* Opportunity Summary Card */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="border-2 border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 text-sm font-medium border ${getTypeColor(opportunityDetails.type)}`}>
            {opportunityDetails.type}
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-3">{opportunityTitle}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Building size={16} className="text-gray-600" />
            <span className="text-base font-semibold text-gray-800">
              {opportunityDetails.company}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{opportunityDetails.location}</span>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">
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
        }} className="flex items-center justify-between mb-8 p-4 bg-gray-50 border-2 border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-600" />
                <span className="text-sm text-gray-600">Takes about {estimatedTime} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-black" initial={{
                  width: 0
                }} animate={{
                  width: `${progress}%`
                }} transition={{
                  duration: 0.5
                }} />
                </div>
                <span className="text-sm text-gray-600">{progress}% complete</span>
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
        }} className="space-y-8">
            {questions.map((question, index) => <div key={question.id} className="border-2 border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-start space-x-2 mb-2">
                    <span className="text-lg font-bold text-gray-700 mt-1">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold leading-relaxed">
                        {question.text}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Text Response */}
                {question.type === 'text' && <div className="space-y-2">
                    <textarea value={answers[question.id] || ''} onChange={e => handleAnswerChange(question.id, e.target.value)} placeholder="Enter your response..." className={`w-full p-4 border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 resize-none ${errors[question.id] ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} rows={4} maxLength={1000} />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {(answers[question.id] || '').length}/1000 characters
                      </span>
                      {errors[question.id] && <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors[question.id]}
                        </p>}
                    </div>
                  </div>}

                {/* Multiple Choice */}
                {question.type === 'multiple_choice' && <div className="space-y-3">
                    {question.options?.map((option, optionIndex) => <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer group">
                        <input type="radio" name={`question-${question.id}`} value={option} checked={answers[question.id] === option} onChange={e => handleAnswerChange(question.id, e.target.value)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" />
                        <span className="text-base group-hover:text-gray-600 transition-colors duration-200">
                          {option}
                        </span>
                      </label>)}
                    {errors[question.id] && <p className="text-red-500 text-sm flex items-center mt-2">
                        <AlertCircle size={16} className="mr-1" />
                        {errors[question.id]}
                      </p>}
                  </div>}

                {/* Yes/No */}
                {question.type === 'yes_no' && <div className="space-y-3">
                    {['Yes', 'No'].map(option => <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                        <input type="radio" name={`question-${question.id}`} value={option} checked={answers[question.id] === option} onChange={e => handleAnswerChange(question.id, e.target.value)} className="w-5 h-5 border-2 border-gray-300 focus:ring-4 focus:ring-black focus:ring-opacity-10" />
                        <span className="text-base group-hover:text-gray-600 transition-colors duration-200">
                          {option}
                        </span>
                      </label>)}
                    {errors[question.id] && <p className="text-red-500 text-sm flex items-center mt-2">
                        <AlertCircle size={16} className="mr-1" />
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
        }} className="flex flex-col space-y-4 mt-12 p-6 bg-gray-50 border-2 border-gray-200">
            <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-700">
              <User size={20} />
              <span className="font-medium text-center sm:text-left">
                {questions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length} of {questions.length} questions answered
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button onClick={handleSaveProgress} disabled={isSaving} className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-6 py-4 sm:py-3 text-base font-semibold hover:border-black hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[48px]">
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Progress'}</span>
              </button>

              <button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto bg-black text-white px-8 py-4 sm:py-3 text-base font-semibold hover:bg-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[48px]">
                <Send size={16} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Answers'}</span>
              </button>
            </div>
          </motion.div>
        </>
      );
    };
    
export default QuestionnaireResponseForm;