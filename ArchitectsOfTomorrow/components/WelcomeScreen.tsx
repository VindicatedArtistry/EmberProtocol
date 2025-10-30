import React, { useState } from 'react';

interface WelcomeScreenProps {
  onBegin: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  const [name, setName] = useState('');

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `}</style>
      <h1 className="text-4xl sm:text-5xl font-serif text-gray-200 mb-4">Architects of Tomorrow</h1>
      <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-6">
        Design your unique learning blueprint. Discover your strengths and build a bridge to how you learn best.
      </p>

      <p className="text-md text-gray-500 italic max-w-xl mx-auto mb-8 border-t border-b border-gray-700 py-4">
        Every great architect needs a blueprint. This is yours. Let's discover the amazing way your mind works and design a guide for how you learn best.
      </p>

      <div className="w-full max-w-sm mb-8">
        <label htmlFor="name-input" className="block text-lg text-gray-400 mb-3">
          First, what name should we put on your blueprint?
        </label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-center text-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          aria-label="Your Name"
          autoFocus
        />
      </div>

      <button
        onClick={() => onBegin(name)}
        disabled={!name.trim()}
        className="px-8 py-3 bg-gray-600 text-gray-100 font-bold rounded-full hover:bg-gray-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none"
      >
        [ Start Designing My Blueprint ]
      </button>
    </div>
  );
};