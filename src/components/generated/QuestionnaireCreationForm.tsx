"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Building, Plus, Trash2, Eye, Save, Send, ChevronDown, ChevronUp, GripVertical, AlertCircle, CheckCircle } from 'lucide-react';
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
  personName = "Sarah Chen",
  opportunityTitle = "Senior Full Stack Developer",
  personProfile = {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    company: "TechFlow Solutions",
    currentProject: "Building a real-time collaboration platform for remote teams using React, Node.js, and WebSocket technology."
  },
  prefilledQuestions = ["What relevant experience do you have with React and Node.js?", "Are you available for full-time work?"],
  onBack,
  onSend,
  onSaveTemplate
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
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
    if (!validateForm()) return;
    setIsLoading(true);
    const allQuestions = [...prefilledQuestionsState, ...questions];

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSend?.(allQuestions);
    setIsLoading(false);
  };
  const handleSaveTemplate = async () => {
    if (!validateForm() || !templateName.trim()) return;
    setIsLoading(true);
    const allQuestions = [...prefilledQuestionsState, ...questions];

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSaveTemplate?.(allQuestions, templateName);
    setShowSaveTemplate(false);
    setTemplateName('');
    setIsLoading(false);
  };
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Navigate back to OpportunityGrabsReview');
    }
  };
  const totalQuestions = prefilledQuestionsState.length + questions.length;
  return <div className="min-h-screen bg-white text-black font-sans" data-magicpath-id="0" data-magicpath-path="QuestionnaireCreationForm.tsx">
      {/* Header Navigation */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200" data-magicpath-id="1" data-magicpath-path="QuestionnaireCreationForm.tsx">
        <div className="max-w-7xl mx-auto" data-magicpath-id="2" data-magicpath-path="QuestionnaireCreationForm.tsx">
          <div className="flex items-center justify-between mb-6" data-magicpath-id="3" data-magicpath-path="QuestionnaireCreationForm.tsx">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-magicpath-id="4" data-magicpath-path="QuestionnaireCreationForm.tsx">
              StartupEcosystem.in
            </h1>
          </div>
          
          {/* Back Navigation */}
          <div className="flex items-center space-x-4 mb-6" data-magicpath-id="5" data-magicpath-path="QuestionnaireCreationForm.tsx">
            <button onClick={handleBack} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="6" data-magicpath-path="QuestionnaireCreationForm.tsx">
              <ChevronLeft size={20} data-magicpath-id="7" data-magicpath-path="QuestionnaireCreationForm.tsx" />
              <span className="text-base font-medium" data-magicpath-id="8" data-magicpath-path="QuestionnaireCreationForm.tsx">Back to Opportunity Review</span>
            </button>
          </div>

          {/* Page Title */}
          <div data-magicpath-id="9" data-magicpath-path="QuestionnaireCreationForm.tsx">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" data-magicpath-id="10" data-magicpath-path="QuestionnaireCreationForm.tsx">
              Send questionnaire to {personName}
            </h2>
            <p className="text-lg font-light text-gray-600" data-magicpath-id="11" data-magicpath-path="QuestionnaireCreationForm.tsx">
              for {opportunityTitle}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24" data-magicpath-id="12" data-magicpath-path="QuestionnaireCreationForm.tsx">
        <div className="max-w-4xl mx-auto" data-magicpath-id="13" data-magicpath-path="QuestionnaireCreationForm.tsx">
          
          {/* Person Profile Summary */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="border-2 border-gray-200 p-6 mb-8" data-magicpath-id="14" data-magicpath-path="QuestionnaireCreationForm.tsx">
            <div className="flex items-start space-x-4" data-magicpath-id="15" data-magicpath-path="QuestionnaireCreationForm.tsx">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0" data-magicpath-id="16" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <User size={32} className="text-gray-600" data-magicpath-id="17" data-magicpath-path="QuestionnaireCreationForm.tsx" />
              </div>
              <div className="flex-1" data-magicpath-id="18" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <h3 className="text-2xl font-bold mb-2" data-magicpath-id="19" data-magicpath-path="QuestionnaireCreationForm.tsx">{personProfile.name}</h3>
                <div className="flex items-center space-x-2 text-gray-600 mb-3" data-magicpath-id="20" data-magicpath-path="QuestionnaireCreationForm.tsx">
                  <span className="font-medium" data-magicpath-id="21" data-magicpath-path="QuestionnaireCreationForm.tsx">{personProfile.role}</span>
                  <span data-magicpath-id="22" data-magicpath-path="QuestionnaireCreationForm.tsx">•</span>
                  <div className="flex items-center space-x-1" data-magicpath-id="23" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    <Building size={16} data-magicpath-id="24" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                    <span data-magicpath-id="25" data-magicpath-path="QuestionnaireCreationForm.tsx">{personProfile.company}</span>
                  </div>
                </div>
                <div data-magicpath-id="26" data-magicpath-path="QuestionnaireCreationForm.tsx">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1" data-magicpath-id="27" data-magicpath-path="QuestionnaireCreationForm.tsx">Current Project:</h4>
                  <p className="text-gray-700 leading-relaxed" data-magicpath-id="28" data-magicpath-path="QuestionnaireCreationForm.tsx">{personProfile.currentProject}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Validation Errors */}
          <AnimatePresence data-magicpath-id="29" data-magicpath-path="QuestionnaireCreationForm.tsx">
            {validationErrors.length > 0 && <motion.div initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} className="border-2 border-red-200 bg-red-50 p-4 mb-6" data-magicpath-id="30" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <div className="flex items-start space-x-2" data-magicpath-id="31" data-magicpath-path="QuestionnaireCreationForm.tsx">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" data-magicpath-id="32" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                  <div data-magicpath-id="33" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    <h4 className="font-semibold text-red-800 mb-2" data-magicpath-id="34" data-magicpath-path="QuestionnaireCreationForm.tsx">Please fix the following issues:</h4>
                    <ul className="space-y-1" data-magicpath-id="35" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      {validationErrors.map((error, index) => <li key={index} className="text-red-700 text-sm" data-magicpath-id="36" data-magicpath-path="QuestionnaireCreationForm.tsx">{error}</li>)}
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
        }} className="mb-8" data-magicpath-id="37" data-magicpath-path="QuestionnaireCreationForm.tsx">
              <h3 className="text-xl font-bold mb-4" data-magicpath-id="38" data-magicpath-path="QuestionnaireCreationForm.tsx">Questions from Opportunity Posting</h3>
              <div className="space-y-4" data-magicpath-id="39" data-magicpath-path="QuestionnaireCreationForm.tsx">
                {prefilledQuestionsState.map((question, index) => <div key={question.id} className="border-2 border-gray-200 p-4" data-magicpath-id="40" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    <div className="flex items-start justify-between mb-3" data-magicpath-id="41" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      <span className="text-sm font-medium text-gray-500" data-magicpath-id="42" data-magicpath-path="QuestionnaireCreationForm.tsx">Question {index + 1}</span>
                      <div className="flex items-center space-x-2" data-magicpath-id="43" data-magicpath-path="QuestionnaireCreationForm.tsx">
                        <select value={question.type} onChange={e => updatePrefilledQuestion(question.id, {
                    type: e.target.value as Question['type']
                  })} className="text-sm border border-gray-300 px-2 py-1 focus:outline-none focus:border-black" data-magicpath-id="44" data-magicpath-path="QuestionnaireCreationForm.tsx">
                          <option value="text" data-magicpath-id="45" data-magicpath-path="QuestionnaireCreationForm.tsx">Text Response</option>
                          <option value="multiple_choice" data-magicpath-id="46" data-magicpath-path="QuestionnaireCreationForm.tsx">Multiple Choice</option>
                          <option value="yes_no" data-magicpath-id="47" data-magicpath-path="QuestionnaireCreationForm.tsx">Yes/No</option>
                        </select>
                      </div>
                    </div>
                    <textarea value={question.text} onChange={e => updatePrefilledQuestion(question.id, {
                text: e.target.value
              })} placeholder="Enter your question..." className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black resize-none" rows={2} maxLength={500} data-magicpath-id="48" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                    <div className="flex items-center justify-between mt-2" data-magicpath-id="49" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      <span className="text-xs text-gray-500" data-magicpath-id="50" data-magicpath-path="QuestionnaireCreationForm.tsx">
                        {question.text.length}/500 characters
                      </span>
                      <label className="flex items-center space-x-2 text-sm" data-magicpath-id="51" data-magicpath-path="QuestionnaireCreationForm.tsx">
                        <input type="checkbox" checked={question.required} onChange={e => updatePrefilledQuestion(question.id, {
                    required: e.target.checked
                  })} className="rounded" data-magicpath-id="52" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                        <span data-magicpath-id="53" data-magicpath-path="QuestionnaireCreationForm.tsx">Required</span>
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
        }} className="mb-8" data-magicpath-id="54" data-magicpath-path="QuestionnaireCreationForm.tsx">
            <div className="flex items-center justify-between mb-4" data-magicpath-id="55" data-magicpath-path="QuestionnaireCreationForm.tsx">
              <h3 className="text-xl font-bold" data-magicpath-id="56" data-magicpath-path="QuestionnaireCreationForm.tsx">Custom Questions</h3>
              <button onClick={() => addQuestion()} className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2" data-magicpath-id="57" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <Plus size={16} data-magicpath-id="58" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                <span data-magicpath-id="59" data-magicpath-path="QuestionnaireCreationForm.tsx">Add Question</span>
              </button>
            </div>

            <AnimatePresence data-magicpath-id="60" data-magicpath-path="QuestionnaireCreationForm.tsx">
              {questions.length > 0 ? <div className="space-y-4" data-magicpath-id="61" data-magicpath-path="QuestionnaireCreationForm.tsx">
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
              }} className="border-2 border-gray-200 p-4" data-magicpath-id="62" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      <div className="flex items-start justify-between mb-3" data-magicpath-id="63" data-magicpath-path="QuestionnaireCreationForm.tsx">
                        <div className="flex items-center space-x-2" data-magicpath-id="64" data-magicpath-path="QuestionnaireCreationForm.tsx">
                          <GripVertical size={16} className="text-gray-400" data-magicpath-id="65" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                          <span className="text-sm font-medium text-gray-500" data-magicpath-id="66" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            Question {prefilledQuestionsState.length + index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2" data-magicpath-id="67" data-magicpath-path="QuestionnaireCreationForm.tsx">
                          <select value={question.type} onChange={e => updateQuestion(question.id, {
                      type: e.target.value as Question['type']
                    })} className="text-sm border border-gray-300 px-2 py-1 focus:outline-none focus:border-black" data-magicpath-id="68" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            <option value="text" data-magicpath-id="69" data-magicpath-path="QuestionnaireCreationForm.tsx">Text Response</option>
                            <option value="multiple_choice" data-magicpath-id="70" data-magicpath-path="QuestionnaireCreationForm.tsx">Multiple Choice</option>
                            <option value="yes_no" data-magicpath-id="71" data-magicpath-path="QuestionnaireCreationForm.tsx">Yes/No</option>
                          </select>
                          <button onClick={() => removeQuestion(question.id)} className="text-red-500 hover:text-red-700 transition-colors duration-200" data-magicpath-id="72" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            <Trash2 size={16} data-magicpath-id="73" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                          </button>
                        </div>
                      </div>

                      <textarea value={question.text} onChange={e => updateQuestion(question.id, {
                  text: e.target.value
                })} placeholder="Enter your question..." className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black resize-none mb-3" rows={2} maxLength={500} data-magicpath-id="74" data-magicpath-path="QuestionnaireCreationForm.tsx" />

                      {question.type === 'multiple_choice' && <div className="mb-3" data-magicpath-id="75" data-magicpath-path="QuestionnaireCreationForm.tsx">
                          <div className="flex items-center justify-between mb-2" data-magicpath-id="76" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            <span className="text-sm font-medium text-gray-700" data-magicpath-id="77" data-magicpath-path="QuestionnaireCreationForm.tsx">Answer Options:</span>
                            <button onClick={() => addMultipleChoiceOption(question.id)} className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200" data-magicpath-id="78" data-magicpath-path="QuestionnaireCreationForm.tsx">
                              + Add Option
                            </button>
                          </div>
                          <div className="space-y-2" data-magicpath-id="79" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            {(question.options || []).map((option, optionIndex) => <div key={optionIndex} className="flex items-center space-x-2" data-magicpath-id="80" data-magicpath-path="QuestionnaireCreationForm.tsx">
                                <input type="text" value={option} onChange={e => updateMultipleChoiceOption(question.id, optionIndex, e.target.value)} placeholder={`Option ${optionIndex + 1}`} className="flex-1 p-2 border border-gray-300 focus:outline-none focus:border-black text-sm" data-magicpath-id="81" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                                <button onClick={() => removeMultipleChoiceOption(question.id, optionIndex)} className="text-red-500 hover:text-red-700 transition-colors duration-200" data-magicpath-id="82" data-magicpath-path="QuestionnaireCreationForm.tsx">
                                  <Trash2 size={14} data-magicpath-id="83" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                                </button>
                              </div>)}
                          </div>
                        </div>}

                      <div className="flex items-center justify-between" data-magicpath-id="84" data-magicpath-path="QuestionnaireCreationForm.tsx">
                        <span className="text-xs text-gray-500" data-magicpath-id="85" data-magicpath-path="QuestionnaireCreationForm.tsx">
                          {question.text.length}/500 characters
                        </span>
                        <label className="flex items-center space-x-2 text-sm" data-magicpath-id="86" data-magicpath-path="QuestionnaireCreationForm.tsx">
                          <input type="checkbox" checked={question.required} onChange={e => updateQuestion(question.id, {
                      required: e.target.checked
                    })} className="rounded" data-magicpath-id="87" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                          <span data-magicpath-id="88" data-magicpath-path="QuestionnaireCreationForm.tsx">Required</span>
                        </label>
                      </div>
                    </motion.div>)}
                </div> : <div className="text-center py-8 text-gray-500" data-magicpath-id="89" data-magicpath-path="QuestionnaireCreationForm.tsx">
                  <p data-magicpath-id="90" data-magicpath-path="QuestionnaireCreationForm.tsx">No custom questions added yet. Click "Add Question" to get started.</p>
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
        }} className="mb-8" data-magicpath-id="91" data-magicpath-path="QuestionnaireCreationForm.tsx">
            <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center justify-between w-full p-4 border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200" data-magicpath-id="92" data-magicpath-path="QuestionnaireCreationForm.tsx">
              <span className="text-lg font-semibold" data-magicpath-id="93" data-magicpath-path="QuestionnaireCreationForm.tsx">Template Questions</span>
              {showTemplates ? <ChevronUp size={20} data-magicpath-id="94" data-magicpath-path="QuestionnaireCreationForm.tsx" /> : <ChevronDown size={20} data-magicpath-id="95" data-magicpath-path="QuestionnaireCreationForm.tsx" />}
            </button>

            <AnimatePresence data-magicpath-id="96" data-magicpath-path="QuestionnaireCreationForm.tsx">
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
            }} className="border-2 border-t-0 border-gray-200 p-4" data-magicpath-id="97" data-magicpath-path="QuestionnaireCreationForm.tsx">
                  <p className="text-sm text-gray-600 mb-4" data-magicpath-id="98" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    Click on any template question to add it to your questionnaire:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-magicpath-id="99" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    {templateQuestions.map((templateQ, index) => <button key={index} onClick={() => addQuestion(templateQ)} className="text-left p-3 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-200 text-sm" data-magicpath-id="100" data-magicpath-path="QuestionnaireCreationForm.tsx">
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
        }} className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 p-6 bg-gray-50 border-2 border-gray-200" data-magicpath-id="101" data-magicpath-path="QuestionnaireCreationForm.tsx">
            <div className="flex items-center space-x-2 text-gray-700" data-magicpath-id="102" data-magicpath-path="QuestionnaireCreationForm.tsx">
              <CheckCircle size={20} data-magicpath-id="103" data-magicpath-path="QuestionnaireCreationForm.tsx" />
              <span className="font-medium" data-magicpath-id="104" data-magicpath-path="QuestionnaireCreationForm.tsx">{totalQuestions} questions ready</span>
            </div>

            <div className="flex items-center space-x-3" data-magicpath-id="105" data-magicpath-path="QuestionnaireCreationForm.tsx">
              <button onClick={() => setShowPreview(!showPreview)} className="border-2 border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold hover:border-black hover:text-black transition-all duration-200 flex items-center space-x-2" data-magicpath-id="106" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <Eye size={16} data-magicpath-id="107" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                <span data-magicpath-id="108" data-magicpath-path="QuestionnaireCreationForm.tsx">Preview</span>
              </button>

              <button onClick={() => setShowSaveTemplate(true)} className="border-2 border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold hover:border-black hover:text-black transition-all duration-200 flex items-center space-x-2" disabled={isLoading} data-magicpath-id="109" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <Save size={16} data-magicpath-id="110" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                <span data-magicpath-id="111" data-magicpath-path="QuestionnaireCreationForm.tsx">Save as Template</span>
              </button>

              <button onClick={handleSend} disabled={isLoading || totalQuestions === 0} className="bg-black text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2" data-magicpath-id="112" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <Send size={16} data-magicpath-id="113" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                <span data-magicpath-id="114" data-magicpath-path="QuestionnaireCreationForm.tsx">{isLoading ? 'Sending...' : 'Send Questionnaire'}</span>
              </button>
            </div>
          </motion.div>

          {/* Preview Modal */}
          <AnimatePresence data-magicpath-id="115" data-magicpath-path="QuestionnaireCreationForm.tsx">
            {showPreview && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-magicpath-id="116" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <motion.div initial={{
              scale: 0.9,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} exit={{
              scale: 0.9,
              opacity: 0
            }} className="bg-white p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-gray-200" data-magicpath-id="117" data-magicpath-path="QuestionnaireCreationForm.tsx">
                  <div className="flex items-center justify-between mb-6" data-magicpath-id="118" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    <h3 className="text-2xl font-bold" data-magicpath-id="119" data-magicpath-path="QuestionnaireCreationForm.tsx">Questionnaire Preview</h3>
                    <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-black transition-colors duration-200" data-magicpath-id="120" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6" data-magicpath-id="121" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    <div className="border-b border-gray-200 pb-4" data-magicpath-id="122" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      <h4 className="font-semibold text-gray-700 mb-2" data-magicpath-id="123" data-magicpath-path="QuestionnaireCreationForm.tsx">To: {personName}</h4>
                      <h4 className="font-semibold text-gray-700 mb-2" data-magicpath-id="124" data-magicpath-path="QuestionnaireCreationForm.tsx">Re: {opportunityTitle}</h4>
                    </div>

                    {[...prefilledQuestionsState, ...questions].map((question, index) => <div key={question.id} className="border-b border-gray-100 pb-4" data-magicpath-id="125" data-magicpath-path="QuestionnaireCreationForm.tsx">
                        <div className="flex items-start space-x-2 mb-2" data-magicpath-id="126" data-magicpath-path="QuestionnaireCreationForm.tsx">
                          <span className="font-semibold text-gray-700" data-magicpath-id="127" data-magicpath-path="QuestionnaireCreationForm.tsx">{index + 1}.</span>
                          <div className="flex-1" data-magicpath-id="128" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            <p className="font-medium" data-magicpath-id="129" data-magicpath-path="QuestionnaireCreationForm.tsx">{question.text}</p>
                            {question.required && <span className="text-red-500 text-sm" data-magicpath-id="130" data-magicpath-path="QuestionnaireCreationForm.tsx">*Required</span>}
                          </div>
                        </div>
                        
                        {question.type === 'text' && <div className="ml-6" data-magicpath-id="131" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            <textarea placeholder="Response will be entered here..." className="w-full p-3 border border-gray-300 resize-none" rows={3} disabled data-magicpath-id="132" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                          </div>}
                        
                        {question.type === 'multiple_choice' && <div className="ml-6 space-y-2" data-magicpath-id="133" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            {(question.options || []).map((option, optionIndex) => <label key={optionIndex} className="flex items-center space-x-2" data-magicpath-id="134" data-magicpath-path="QuestionnaireCreationForm.tsx">
                                <input type="radio" name={`question-${question.id}`} disabled data-magicpath-id="135" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                                <span data-magicpath-id="136" data-magicpath-path="QuestionnaireCreationForm.tsx">{option}</span>
                              </label>)}
                          </div>}
                        
                        {question.type === 'yes_no' && <div className="ml-6 space-y-2" data-magicpath-id="137" data-magicpath-path="QuestionnaireCreationForm.tsx">
                            <label className="flex items-center space-x-2" data-magicpath-id="138" data-magicpath-path="QuestionnaireCreationForm.tsx">
                              <input type="radio" name={`question-${question.id}`} disabled data-magicpath-id="139" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                              <span data-magicpath-id="140" data-magicpath-path="QuestionnaireCreationForm.tsx">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2" data-magicpath-id="141" data-magicpath-path="QuestionnaireCreationForm.tsx">
                              <input type="radio" name={`question-${question.id}`} disabled data-magicpath-id="142" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                              <span data-magicpath-id="143" data-magicpath-path="QuestionnaireCreationForm.tsx">No</span>
                            </label>
                          </div>}
                      </div>)}
                  </div>
                </motion.div>
              </motion.div>}
          </AnimatePresence>

          {/* Save Template Modal */}
          <AnimatePresence data-magicpath-id="144" data-magicpath-path="QuestionnaireCreationForm.tsx">
            {showSaveTemplate && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-magicpath-id="145" data-magicpath-path="QuestionnaireCreationForm.tsx">
                <motion.div initial={{
              scale: 0.9,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} exit={{
              scale: 0.9,
              opacity: 0
            }} className="bg-white p-8 max-w-md w-full border-2 border-gray-200" data-magicpath-id="146" data-magicpath-path="QuestionnaireCreationForm.tsx">
                  <h3 className="text-2xl font-bold mb-4" data-magicpath-id="147" data-magicpath-path="QuestionnaireCreationForm.tsx">Save as Template</h3>
                  <p className="text-gray-600 mb-6" data-magicpath-id="148" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    Give your questionnaire template a name so you can reuse it later.
                  </p>
                  
                  <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name..." className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black mb-6" maxLength={100} data-magicpath-id="149" data-magicpath-path="QuestionnaireCreationForm.tsx" />
                  
                  <div className="flex items-center justify-end space-x-4" data-magicpath-id="150" data-magicpath-path="QuestionnaireCreationForm.tsx">
                    <button onClick={() => setShowSaveTemplate(false)} className="px-6 py-3 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200" data-magicpath-id="151" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      Cancel
                    </button>
                    <button onClick={handleSaveTemplate} disabled={!templateName.trim() || isLoading} className="bg-black text-white px-6 py-3 text-base font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" data-magicpath-id="152" data-magicpath-path="QuestionnaireCreationForm.tsx">
                      {isLoading ? 'Saving...' : 'Save Template'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 border-t border-black mt-16" data-magicpath-id="153" data-magicpath-path="QuestionnaireCreationForm.tsx">
        <div className="max-w-7xl mx-auto text-center" data-magicpath-id="154" data-magicpath-path="QuestionnaireCreationForm.tsx">
          <p className="text-lg font-light" data-magicpath-id="155" data-magicpath-path="QuestionnaireCreationForm.tsx">
            © 2024 StartupEcosystem.in — Building the future, one connection at a time.
          </p>
        </div>
      </footer>
    </div>;
};
export default QuestionnaireCreationForm;