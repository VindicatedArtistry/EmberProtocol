
import React from 'react';
import { UserPath } from '../types';

interface LoadingScreenProps {
  message: string;
  secondaryMessage?: string;
  userPath: UserPath | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, secondaryMessage, userPath }) => {
  const dotColor = userPath === 'artist' ? '#c084fc' : '#2dd4bf'; // Corresponds to purple-400 and teal-400
  const dotFlashingColor = userPath === 'artist' ? 'rgba(192, 132, 252, 0.2)' : 'rgba(45, 212, 191, 0.2)';

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: ${dotColor};
          color: ${dotColor};
          animation: dotFlashing 1s infinite linear alternate;
          animation-delay: .5s;
        }
        .dot-flashing::before, .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: ${dotColor};
          color: ${dotColor};
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: ${dotColor};
          color: ${dotColor};
          animation: dotFlashing 1s infinite alternate;
          animation-delay: 1s;
        }
        
        @keyframes dotFlashing {
          0% { background-color: ${dotColor}; }
          50%, 100% { background-color: ${dotFlashingColor}; }
        }
      `}</style>
      <div className="dot-flashing mb-8"></div>
      <p className="text-lg text-gray-400 max-w-md">{message}</p>
      {secondaryMessage && (
          <p className="text-md text-gray-500 italic max-w-md mt-6">{secondaryMessage}</p>
      )}
    </div>
  );
};