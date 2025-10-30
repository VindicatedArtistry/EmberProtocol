import React, { useState, useEffect } from 'react';
import { Question, Answers, Example, UserPath } from '../types';

interface QuestionScreenProps {
  questions: Question[];
  answers: Answers;
  onAnswersChange: (answers: Answers) => void;
  onComplete: (answers: Answers) => void;
  examples: Record<string, Example[]>;
  userPath: UserPath | null;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ questions, answers, onAnswersChange, onComplete, examples, userPath }) => {
  
  const getFollowUpKey = (question: Question): string => `${question.text}-followup`;

  const findResumeIndex = () => {
    if (!questions || questions.length === 0) return 0;
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.type === 'multichoice' && q.followUp) {
            const followUpKey = getFollowUpKey(q);
            if (!answers.hasOwnProperty(q.text) || !answers.hasOwnProperty(followUpKey)) {
                return i;
            }
        } else {
            if (!answers.hasOwnProperty(q.text)) {
                return i;
            }
        }
    }
    return questions.length; // All questions answered
  };

  const [currentIndex, setCurrentIndex] = useState(findResumeIndex);
  const [isFading, setIsFading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // State for different question types
  const [mcSelection, setMcSelection] = useState('');
  const [mcOtherValue, setMcOtherValue] = useState('');
  const [followUpValue, setFollowUpValue] = useState('');
  const [singleAnswerValue, setSingleAnswerValue] = useState('');

  const currentQuestion = questions[currentIndex];
  const isMultiPart = currentQuestion?.type === 'multichoice' && !!currentQuestion.followUp;

  // Theme colors based on user path
  const theme = {
    sectionText: userPath === 'artist' ? 'text-purple-400' : 'text-teal-400',
    progressBar: userPath === 'artist' ? 'bg-purple-500' : 'bg-teal-500',
    radio: userPath === 'artist' ? 'text-purple-500' : 'text-teal-500',
    ring: userPath === 'artist' ? 'focus:ring-purple-500' : 'focus:ring-teal-500',
    button: userPath === 'artist' ? 'bg-purple-500 text-gray-100 hover:bg-purple-400' : 'bg-teal-500 text-gray-900 hover:bg-teal-400',
    exampleButton: userPath === 'artist' ? 'text-purple-400 hover:text-purple-300' : 'text-teal-400 hover:text-teal-300',
    cardBg: userPath === 'artist' ? 'bg-indigo-800' : 'bg-slate-800',
    cardHoverBg: userPath === 'artist' ? 'hover:bg-indigo-700' : 'hover:bg-slate-700',
    inputBg: userPath === 'artist' ? 'bg-indigo-800' : 'bg-slate-800',
  };

  // Effect to synchronize component state with answers from props
  useEffect(() => {
    if (!currentQuestion) return;

    if (isMultiPart) {
      const followUpKey = getFollowUpKey(currentQuestion);
      const mainAnswer = answers[currentQuestion.text] || '';
      const followUpAnswer = answers[followUpKey] || '';
      
      const isPredefinedOption = currentQuestion.options?.includes(mainAnswer);
      
      if (isPredefinedOption) {
        setMcSelection(mainAnswer);
        setMcOtherValue('');
      } else if (mainAnswer) {
        setMcSelection('Other');
        setMcOtherValue(mainAnswer);
      } else {
        setMcSelection('');
        setMcOtherValue('');
      }
      setFollowUpValue(followUpAnswer);
      setSingleAnswerValue('');
    } else {
      setSingleAnswerValue(answers[currentQuestion.text] || '');
      setMcSelection('');
      setMcOtherValue('');
      setFollowUpValue('');
    }
    
    setShowExamples(false);
    const timer = setTimeout(() => setIsFading(false), 10);
    return () => clearTimeout(timer);
  }, [currentIndex, questions, answers]);
  
  // Effect to auto-complete if all questions are already answered on load
  useEffect(() => {
    if (currentIndex >= questions.length && questions.length > 0) {
        onComplete(answers);
    }
  }, [currentIndex, questions, onComplete, answers]);

  const handleNext = () => {
    setIsFading(true);
    
    let newAnswers: Answers;
    if (isMultiPart) {
      const followUpKey = getFollowUpKey(currentQuestion);
      const mainAnswerValue = mcSelection === 'Other' ? mcOtherValue : mcSelection;
      newAnswers = {
        ...answers,
        [currentQuestion.text]: mainAnswerValue,
        [followUpKey]: followUpValue,
      };
    } else {
      newAnswers = { ...answers, [currentQuestion.text]: singleAnswerValue };
    }
    
    onAnswersChange(newAnswers);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 500);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 500);
    }
  };
  
  if (currentIndex >= questions.length || !currentQuestion) {
    return null;
  }

  const examplesForCurrentQuestion = examples[currentQuestion.text] || [];
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
  
  const isNextDisabled = isMultiPart
    ? !mcSelection || (mcSelection === 'Other' && !mcOtherValue.trim()) || !followUpValue.trim()
    : !singleAnswerValue.trim();

  const renderMultiPartQuestion = () => (
    <>
      <h2 className="text-2xl sm:text-3xl text-gray-200 mb-6 leading-snug">{currentQuestion.text}</h2>
      <div className="space-y-3 mb-6">
        {currentQuestion.options?.map(option => (
          <label key={option} className={`flex items-center p-3 ${theme.cardBg} rounded-lg cursor-pointer ${theme.cardHoverBg} transition-colors`}>
            <input type="radio" name="identity" value={option} checked={mcSelection === option} onChange={(e) => setMcSelection(e.target.value)} className={`w-5 h-5 ${theme.radio} bg-gray-700 border-gray-600 ${theme.ring}`} />
            <span className="ml-3 text-gray-300">{option}</span>
          </label>
        ))}
        <label className={`flex items-center p-3 ${theme.cardBg} rounded-lg cursor-pointer ${theme.cardHoverBg} transition-colors`}>
          <input type="radio" name="identity" value="Other" checked={mcSelection === 'Other'} onChange={(e) => setMcSelection(e.target.value)} className={`w-5 h-5 ${theme.radio} bg-gray-700 border-gray-600 ${theme.ring}`} />
          <span className="ml-3 text-gray-300">Other:</span>
        </label>
        {mcSelection === 'Other' && (
          <input 
            type="text" 
            value={mcOtherValue} 
            onChange={(e) => setMcOtherValue(e.target.value)} 
            placeholder="Please specify..." 
            className={`w-full mt-2 p-3 ${theme.inputBg} border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 ${theme.ring} transition-colors`}
            autoFocus 
          />
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl text-gray-200 mb-6 leading-snug mt-8">{currentQuestion.followUp}</h2>
      <textarea
        value={followUpValue}
        onChange={(e) => setFollowUpValue(e.target.value)}
        placeholder="Your truth..."
        className={`w-full h-48 p-4 ${theme.inputBg} border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 ${theme.ring} transition-colors`}
      />
    </>
  );

  const renderSingleQuestion = () => (
    <>
      <h2 className="text-2xl sm:text-3xl text-gray-200 mb-6 leading-snug">{currentQuestion.text}</h2>
      <textarea
        value={singleAnswerValue}
        onChange={(e) => setSingleAnswerValue(e.target.value)}
        placeholder="Your truth..."
        className={`w-full h-48 p-4 ${theme.inputBg} border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 ${theme.ring} transition-colors`}
        autoFocus
      />
    </>
  );

  return (
    <div className="flex flex-col h-full">
       <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.5s ease-out forwards; }
      `}</style>
      <div className={`transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <p className={`${theme.sectionText} font-semibold mb-2`}>{currentQuestion.section}</p>
        
        {isMultiPart ? renderMultiPartQuestion() : renderSingleQuestion()}

        {examplesForCurrentQuestion.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowExamples(prev => !prev)}
              className={`${theme.exampleButton} transition-colors text-sm font-semibold`}
              aria-expanded={showExamples}
            >
              {showExamples ? 'Hide examples' : 'See how others answered'}
            </button>
            {showExamples && (
              <div className="mt-3 space-y-4 border-l-2 border-gray-700 pl-4 animate-fade-in-fast">
                {examplesForCurrentQuestion.map((ex, i) => (
                  <blockquote key={i}>
                    <p className="text-gray-400 italic">"{ex.quote}"</p>
                    <footer className="text-right text-gray-500 text-sm mt-1">- {ex.author}</footer>
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className={`${theme.progressBar} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex items-center gap-4">
            {currentIndex > 0 && (
                <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-600 text-gray-200 font-bold rounded-lg hover:bg-gray-500 transition-colors duration-300"
                >
                    Back
                </button>
            )}
            <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className={`flex-grow px-6 py-3 font-bold rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed ${theme.button}`}
            >
                {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
        </div>
      </div>
    </div>
  );
};