"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Building, Plus, Trash2, Eye, Save, Send, ChevronDown, ChevronUp, GripVertical, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { questionnairesService, Question as ServiceQuestion } from '../../services/questionnaires';
import { profilesService } from '../../services/profiles';
interface PersonProfile {
  name: string;
  role: string;
  company: string;
  currentProject: string;
  profileImage?: string;
}
interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'yes_no';
  options?: string[];
  required?: boolean;
}
interface QuestionnaireCreationFormProps {
  personName?: string;
  opportunityTitle?: string;
  personProfile?: PersonProfile;
  prefilledQuestions?: string[];
  onBack?: () => void;
  onSend?: (questions: Question[]) => void;
  onSaveTemplate?: (questions: Question[], templateName: string) => void;
}
const QuestionnaireCreationForm: React.FC<QuestionnaireCreationFormProps> = ({
  personName,
  opportunityTitle,
  personProfile,
  prefilledQuestions = [],
  onBack,
  onSend,
  onSaveTemplate
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { opportunityId, userId } = useParams<{ opportunityId: string; userId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opportunity, setOpportunity] = useState<any>(null);
  const [profile, setProfile] = useState<PersonProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Load opportunity and profile data
  useEffect(() => {
    const loadData = async () => {
      if (!user || !opportunityId || !userId) return;
      
      try {
        setLoading(true);
        
        // Load opportunity details
        if (opportunityId) {
          // You would need to implement getOpportunity in opportunities service
          // const opportunityData = await opportunitiesService.getOpportunity(opportunityId);
          // setOpportunity(opportunityData);
        }
        
        // Load profile details
        const profileData = await profilesService.getProfileById(userId);
        if (profileData) {
          setProfile({
            name: profileData.name,
            role: profileData.role,
            company: profileData.company,
            currentProject: profileData.current_project || 'No project information available'
          });
        }
        
        // Set prefilled questions from opportunity
        if (opportunity?.screening_questions) {
          const questions = opportunity.screening_questions.split('\n').filter((q: string) => q.trim());
          setPrefilledQuestionsState(questions.map((q: string, index: number) => ({
            id: `prefilled-${index}`,
            text: q,
            type: 'text' as const,
            required: true
          })));
        }
        
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, opportunityId, userId]);
  const [prefilledQuestionsState, setPrefilledQuestionsState] = useState<Question[]>(prefilledQuestions.map((q, index) => ({
    id: `prefilled-${index}`,
    text: q,
    type: 'text' as const,
    required: true
  })));
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const templateQuestions = ["Why are you interested in this opportunity?", "What relevant experience do you have?", "When are you available to start?", "What is your expected salary/compensation?", "Do you have any questions about this role?", "What motivates you in your work?", "How do you handle working in a fast-paced startup environment?", "What's your preferred working style (remote, hybrid, in-office)?"];
  const addQuestion = (questionText?: string) => {
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      text: questionText || '',
      type: 'text',
      required: false
    };
    setQuestions(prev => [...prev, newQuestion]);
  };
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? {
      ...q,
      ...updates
    } : q));
  };
  const updatePrefilledQuestion = (id: string, updates: Partial<Question>) => {
    setPrefilledQuestionsState(prev => prev.map(q => q.id === id ? {
      ...q,
      ...updates
    } : q));
  };
  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };
  const addMultipleChoiceOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || []), ''];
      updateQuestion(questionId, {
        options: newOptions
      });
    }
  };
  const updateMultipleChoiceOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, {
        options: newOptions
      });
    }
  };
  const removeMultipleChoiceOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, {
        options: newOptions
      });
    }
  };
  const validateForm = () => {
    const errors: string[] = [];
    const allQuestions = [...prefilledQuestionsState, ...questions];
    if (allQuestions.length === 0) {
      errors.push("Please add at least one question to the questionnaire.");
    }
    allQuestions.forEach((question, index) => {
      if (!question.text.trim()) {
        errors.push(`Question ${index + 1} cannot be empty.`);
      }
      if (question.type === 'multiple_choice' && (!question.options || question.options.length < 2)) {
        errors.push(`Question ${index + 1} must have at least 2 options for multiple choice.`);
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };
  const handleSend = async () => {
    if (!validateForm() || !user || !opportunityId || !userId) return;
    setIsLoading(true);
    const allQuestions = [...prefilledQuestionsState, ...questions];

    try {
      await questionnairesService.createQuestionnaire({
        opportunity_id: opportunityId,
        recipient_id: userId,
        questions: allQuestions,
        expires_in_days: 7
      });

      // Navigate back to opportunity review
      navigate(`/opportunities/${opportunityId}/review`);
    } catch (err) {
      console.error('Error sending questionnaire:', err);
      setError('Failed to send questionnaire. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveTemplate = async () => {
    if (!validateForm() || !templateName.trim()) return;
    setIsLoading(true);
    const allQuestions = [...prefilledQuestionsState, ...questions];

    try {
      await questionnairesService.createTemplate({
        name: templateName,
        description: `Template for ${opportunity?.title || 'opportunity'}`,
        questions: allQuestions,
        is_public: false
      });

      setShowSaveTemplate(false);
      setTemplateName('');
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (opportunityId) {
      navigate(`/opportunities/${opportunityId}/review`);
    } else {
      navigate('/my-opportunities');
    }
  };
  const totalQuestions = prefilledQuestionsState.length + questions.length;
  return <div className="min-h-screen bg-white text-black font-sans">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Back Navigation */}
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200">
              <ArrowLeft size={20} />
              <span className="text-base font-medium">Back</span>
            </button>
          </div>

          {/* Page Title */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Send questionnaire to {profile?.name || personName || 'Candidate'}
            </h2>
            <p className="text-lg font-light text-gray-600">
              for {opportunity?.title || opportunityTitle || 'Opportunity'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Loading State */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Loading questionnaire form...</h3>
              <p className="text-gray-600 text-lg">Please wait while we load the data.</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mb-6">
                <AlertCircle size={64} className="mx-auto text-red-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-600">Error Loading Data</h3>
              <p className="text-gray-600 text-lg mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-6 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Person Profile Summary */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="border-2 border-gray-200 p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={32} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{profile?.name || personProfile?.name || 'Candidate'}</h3>
                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <span className="font-medium">{profile?.role || personProfile?.role || 'Role'}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Building size={16} />
                    <span>{profile?.company || personProfile?.company || 'Company'}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Current Project:</h4>
                  <p className="text-gray-700 leading-relaxed">{profile?.currentProject || personProfile?.currentProject || 'No project information available'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Validation Errors */}
          <AnimatePresence>
            {validationErrors.length > 0 && <motion.div initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} className="border-2 border-red-200 bg-red-50 p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Please fix the following issues:</h4>
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => <li key={index} className="text-red-700 text-sm">{error}</li>)}
                    </ul>
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>

          {/* Pre-filled Questions Section */}
          {prefilledQuestionsState.length > 0 && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="mb-8">
              <h3 className="text-xl font-bold mb-4">Questions from Opportunity Posting</h3>
              <div className="space-y-4">
                {prefilledQuestionsState.map((question, index) => <div key={question.id} className="border-2 border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <select value={question.type} onChange={e => updatePrefilledQuestion(question.id, {
                    type: e.target.value as Question['type']
                  })} className="text-sm border border-gray-300 px-2 py-1 focus:outline-none focus:border-black">
                          <option value="text">Text Response</option>
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="yes_no">Yes/No</option>
                        </select>
                      </div>
                    </div>
                    <textarea value={question.text} onChange={e => updatePrefilledQuestion(question.id, {
                text: e.target.value
              })} placeholder="Enter your question..." className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black resize-none" rows={2} maxLength={500} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {question.text.length}/500 characters
                      </span>
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={question.required} onChange={e => updatePrefilledQuestion(question.id, {
                    required: e.target.checked
                  })} className="rounded" />
                        <span>Required</span>
                      </label>
                    </div>
                  </div>)}
              </div>
            </motion.div>}

          {/* Custom Questions Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Custom Questions</h3>
              <button onClick={() => addQuestion()} className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Question</span>
              </button>
            </div>

            <AnimatePresence>
              {questions.length > 0 ? <div className="space-y-4">
                  {questions.map((question, index) => <motion.div key={question.id} initial={{
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
              }} className="border-2 border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <GripVertical size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">
                            Question {prefilledQuestionsState.length + index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select value={question.type} onChange={e => updateQuestion(question.id, {
                      type: e.target.value as Question['type']
                    })} className="text-sm border border-gray-300 px-2 py-1 focus:outline-none focus:border-black">
                            <option value="text">Text Response</option>
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="yes_no">Yes/No</option>
                          </select>
                          <button onClick={() => removeQuestion(question.id)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <textarea value={question.text} onChange={e => updateQuestion(question.id, {
                  text: e.target.value
                })} placeholder="Enter your question..." className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black resize-none mb-3" rows={2} maxLength={500} />

                      {question.type === 'multiple_choice' && <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Answer Options:</span>
                            <button onClick={() => addMultipleChoiceOption(question.id)} className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200">
                              + Add Option
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(question.options || []).map((option, optionIndex) => <div key={optionIndex} className="flex items-center space-x-2">
                                <input type="text" value={option} onChange={e => updateMultipleChoiceOption(question.id, optionIndex, e.target.value)} placeholder={`Option ${optionIndex + 1}`} className="flex-1 p-2 border border-gray-300 focus:outline-none focus:border-black text-sm" />
                                <button onClick={() => removeMultipleChoiceOption(question.id, optionIndex)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
                                  <Trash2 size={14} />
                                </button>
                              </div>)}
                          </div>
                        </div>}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {question.text.length}/500 characters
                        </span>
                        <label className="flex items-center space-x-2 text-sm">
                          <input type="checkbox" checked={question.required} onChange={e => updateQuestion(question.id, {
                      required: e.target.checked
                    })} className="rounded" />
                          <span>Required</span>
                        </label>
                      </div>
                    </motion.div>)}
                </div> : <div className="text-center py-8 text-gray-500">
                  <p>No custom questions added yet. Click "Add Question" to get started.</p>
                </div>}
            </AnimatePresence>
          </motion.div>

          {/* Template Questions */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="mb-8">
            <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center justify-between w-full p-4 border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200">
              <span className="text-lg font-semibold">Template Questions</span>
              {showTemplates ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <AnimatePresence>
              {showTemplates && <motion.div initial={{
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
            }} className="border-2 border-t-0 border-gray-200 p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Click on any template question to add it to your questionnaire:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templateQuestions.map((templateQ, index) => <button key={index} onClick={() => addQuestion(templateQ)} className="text-left p-3 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-200 text-sm">
                        {templateQ}
                      </button>)}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 p-6 bg-gray-50 border-2 border-gray-200">
            <div className="flex items-center space-x-2 text-gray-700">
              <CheckCircle size={20} />
              <span className="font-medium">{totalQuestions} questions ready</span>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={() => setShowPreview(!showPreview)} className="border-2 border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold hover:border-black hover:text-black transition-all duration-200 flex items-center space-x-2">
                <Eye size={16} />
                <span>Preview</span>
              </button>

              <button onClick={() => setShowSaveTemplate(true)} className="border-2 border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold hover:border-black hover:text-black transition-all duration-200 flex items-center space-x-2" disabled={isLoading}>
                <Save size={16} />
                <span>Save as Template</span>
              </button>

              <button onClick={handleSend} disabled={isLoading || totalQuestions === 0} className="bg-black text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                <Send size={16} />
                <span>{isLoading ? 'Sending...' : 'Send Questionnaire'}</span>
              </button>
            </div>
          </motion.div>

          {/* Preview Modal */}
          <AnimatePresence>
            {showPreview && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div initial={{
              scale: 0.9,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} exit={{
              scale: 0.9,
              opacity: 0
            }} className="bg-white p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Questionnaire Preview</h3>
                    <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-black transition-colors duration-200">
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">To: {personName}</h4>
                      <h4 className="font-semibold text-gray-700 mb-2">Re: {opportunityTitle}</h4>
                    </div>

                    {[...prefilledQuestionsState, ...questions].map((question, index) => <div key={question.id} className="border-b border-gray-100 pb-4">
                        <div className="flex items-start space-x-2 mb-2">
                          <span className="font-semibold text-gray-700">{index + 1}.</span>
                          <div className="flex-1">
                            <p className="font-medium">{question.text}</p>
                            {question.required && <span className="text-red-500 text-sm">*Required</span>}
                          </div>
                        </div>
                        
                        {question.type === 'text' && <div className="ml-6">
                            <textarea placeholder="Response will be entered here..." className="w-full p-3 border border-gray-300 resize-none" rows={3} disabled />
                          </div>}
                        
                        {question.type === 'multiple_choice' && <div className="ml-6 space-y-2">
                            {(question.options || []).map((option, optionIndex) => <label key={optionIndex} className="flex items-center space-x-2">
                                <input type="radio" name={`question-${question.id}`} disabled />
                                <span>{option}</span>
                              </label>)}
                          </div>}
                        
                        {question.type === 'yes_no' && <div className="ml-6 space-y-2">
                            <label className="flex items-center space-x-2">
                              <input type="radio" name={`question-${question.id}`} disabled />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="radio" name={`question-${question.id}`} disabled />
                              <span>No</span>
                            </label>
                          </div>}
                      </div>)}
                  </div>
                </motion.div>
              </motion.div>}
          </AnimatePresence>

          {/* Save Template Modal */}
          <AnimatePresence>
            {showSaveTemplate && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div initial={{
              scale: 0.9,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} exit={{
              scale: 0.9,
              opacity: 0
            }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200">
                  <h3 className="text-2xl font-bold mb-4">Save as Template</h3>
                  <p className="text-gray-600 mb-6">
                    Give your questionnaire template a name so you can reuse it later.
                  </p>
                  
                  <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name..." className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black mb-6" maxLength={100} />
                  
                  <div className="flex items-center justify-end space-x-4">
                    <button onClick={() => setShowSaveTemplate(false)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200">
                      Cancel
                    </button>
                    <button onClick={handleSaveTemplate} disabled={!templateName.trim() || isLoading} className="bg-black text-white px-6 py-3 text-base font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Saving...' : 'Save Template'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>}
          </AnimatePresence>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg font-light">
            © 2025 Startup Ecosystem — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default QuestionnaireCreationForm;