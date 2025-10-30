import React from 'react';
import { UserPath } from '../types';

interface PathSelectionScreenProps {
  onPathSelect: (path: UserPath) => void;
}

export const PathSelectionScreen: React.FC<PathSelectionScreenProps> = ({ onPathSelect }) => {
  return (
    <div className="text-center animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .door-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .door-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <h1 className="text-3xl sm:text-4xl font-serif text-gray-300 mb-4">Choose Your Path</h1>
      <p className="text-lg text-gray-400 mb-10">How do you build your world? With logic and systems, or with colors and feelings?</p>

      <div className="flex flex-col sm:flex-row gap-8 justify-center">
        {/* Engineer's Blueprint Door */}
        <div
          onClick={() => onPathSelect('engineer')}
          className="door-card cursor-pointer bg-slate-800 border-2 border-teal-500/50 rounded-lg p-8 flex flex-col items-center w-full sm:w-64"
        >
          <div className="text-5xl mb-4">⚙️</div>
          <h2 className="text-2xl font-serif text-teal-300 mb-2">The Engineer's Blueprint</h2>
          <p className="text-gray-400">For the builder, the problem-solver, the systems thinker.</p>
        </div>

        {/* Artist's Palette Door */}
        <div
          onClick={() => onPathSelect('artist')}
          className="door-card cursor-pointer bg-indigo-800 border-2 border-purple-400/50 rounded-lg p-8 flex flex-col items-center w-full sm:w-64"
        >
          <div className="text-5xl mb-4">🎨</div>
          <h2 className="text-2xl font-serif text-purple-300 mb-2">The Artist's Palette</h2>
          <p className="text-gray-400">For the dreamer, the creator, the storyteller.</p>
        </div>
      </div>
    </div>
  );
};