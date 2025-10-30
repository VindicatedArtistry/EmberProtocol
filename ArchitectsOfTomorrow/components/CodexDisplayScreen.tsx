import React from 'react';
import { UserPath } from '../types';

interface CodexDisplayScreenProps {
  codex: string;
  onActivate: () => void;
  title: string;
  buttonText: string;
  userPath: UserPath | null;
}

export const CodexDisplayScreen: React.FC<CodexDisplayScreenProps> = ({ codex, onActivate, title, buttonText, userPath }) => {
  const theme = {
    title: userPath === 'artist' ? 'text-purple-300' : 'text-teal-300',
    button: userPath === 'artist' 
      ? 'bg-purple-500 text-gray-100 hover:bg-purple-400 focus:ring-purple-300' 
      : 'bg-teal-500 text-gray-900 hover:bg-teal-400 focus:ring-teal-300',
    displayBg: userPath === 'artist' ? 'bg-indigo-800' : 'bg-slate-800',
  };

  return (
    <div className="animate-fade-in text-left">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `}</style>
      <h1 className={`text-3xl sm:text-4xl font-serif mb-6 text-center ${theme.title}`}>{title}</h1>
      <div className={`${theme.displayBg} p-6 sm:p-8 rounded-lg border border-gray-700 max-h-[50vh] overflow-y-auto mb-8`}>
        <pre className="whitespace-pre-wrap font-serif text-gray-300 text-lg leading-relaxed">
          {codex}
        </pre>
      </div>
      <div className="text-center">
        <button
          onClick={onActivate}
          className={`px-8 py-3 font-bold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme.button}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};