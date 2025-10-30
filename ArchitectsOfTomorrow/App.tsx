import React, { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PathSelectionScreen } from './components/PathSelectionScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { CodexDisplayScreen } from './components/CodexDisplayScreen';
import { SoulSeedScreen } from './components/SoulSeedScreen';
import { AppState, Answers, UserPath } from './types';
import { ENGINEER_QUESTIONS, ARTIST_QUESTIONS, ENGINEER_EXAMPLES, ARTIST_EXAMPLES } from './constants';
import { generateDeepDiveQuestions, generateCodex } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'architects-blueprint-progress';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) return {};
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Failed to load state from local storage", e);
    return {};
  }
};


const App: React.FC = () => {
  const [savedState] = useState(loadState);

  const [appState, setAppState] = useState<AppState>(savedState.appState ?? AppState.Welcome);
  const [userName, setUserName] = useState<string>(savedState.userName ?? '');
  const [userPath, setUserPath] = useState<UserPath | null>(savedState.userPath ?? null);
  const [initialAnswers, setInitialAnswers] = useState<Answers>(savedState.initialAnswers ?? {});
  const [deepDiveQuestions, setDeepDiveQuestions] = useState<string[]>(savedState.deepDiveQuestions ?? []);
  const [deepDiveAnswers, setDeepDiveAnswers] = useState<Answers>(savedState.deepDiveAnswers ?? {});
  const [finalCodex, setFinalCodex] = useState<string>(savedState.finalCodex ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
        const stateToSave = {
            appState,
            userName,
            userPath,
            initialAnswers,
            deepDiveQuestions,
            deepDiveAnswers,
            finalCodex,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
        console.warn("Failed to save state to local storage", e);
    }
  }, [appState, userName, userPath, initialAnswers, deepDiveQuestions, deepDiveAnswers, finalCodex]);

  useEffect(() => {
    const body = document.body;
    // Remove all possible theme classes before adding the new one
    body.classList.remove('bg-gray-900', 'bg-slate-900', 'bg-indigo-900');

    if (userPath === 'engineer') {
      body.classList.add('bg-slate-900');
    } else if (userPath === 'artist') {
      body.classList.add('bg-indigo-900');
    } else {
      // Default for Welcome and PathSelection screens
      body.classList.add('bg-gray-900');
    }
  }, [userPath]);

  const handleStartNew = useCallback(() => {
    if (window.confirm("Are you sure you want to start over? All your progress will be lost.")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setAppState(AppState.Welcome);
        setUserName('');
        setUserPath(null);
        setInitialAnswers({});
        setDeepDiveQuestions([]);
        setDeepDiveAnswers({});
        setFinalCodex('');
        setError(null);
    }
  }, []);

  const handleBegin = (name: string) => {
    // If starting a new session with a new name, clear old data.
    if (name !== userName) {
        setInitialAnswers({});
        setDeepDiveQuestions([]);
        setDeepDiveAnswers({});
        setFinalCodex('');
        setUserPath(null);
    }
    setUserName(name);
    setAppState(AppState.PathSelection);
  };

  const handlePathSelect = (path: UserPath) => {
    setUserPath(path);
    setAppState(AppState.InitialQuestions);
  };

  const handleInitialAnswersComplete = useCallback(async (answers: Answers) => {
    if (!userPath) return;
    setInitialAnswers(answers);
    setAppState(AppState.GeneratingDeepDive);
    setError(null);
    try {
      // Only generate questions if they don't already exist from a previous session
      if (deepDiveQuestions.length === 0) {
        const questions = await generateDeepDiveQuestions(answers, userName, userPath);
        setDeepDiveQuestions(questions.map((q, i) => `${i + 1}. ${q}`)); // Add numbering
      }
      setAppState(AppState.DeepDiveQuestions);
    } catch (err) {
      console.error('Error generating deep dive questions:', err);
      setError('An error occurred while generating deeper questions. Please try refreshing.');
      setAppState(AppState.Error);
    }
  }, [userName, userPath, deepDiveQuestions]);

  const handleDeepDiveAnswersComplete = useCallback(async (answers: Answers) => {
    if (!userPath) return;
    setDeepDiveAnswers(answers);
    setAppState(AppState.GeneratingCodex);
    setError(null);
    try {
      const allAnswers = { ...initialAnswers, ...answers };
      const codex = await generateCodex(allAnswers, userName, userPath);
      setFinalCodex(codex);
      setAppState(AppState.CodexDisplay);
    } catch (err) {
      console.error('Error generating codex:', err);
      setError('An error occurred while forging your masterpiece. Please try refreshing.');
      setAppState(AppState.Error);
    }
  }, [initialAnswers, userName, userPath]);

  const handleActivate = () => {
    setAppState(AppState.SoulSeedDisplay);
  };

  const handleSoulSeedComplete = () => {
    const finalTitle = userPath === 'artist' ? "ARTIST'S PALETTE" : "ARCHITECT'S BLUEPRINT";
    console.log(`--- ${finalTitle} FINALIZED & SOULSEED GENERATED ---`);
    console.log("User:", userName);
    console.log(finalCodex);
    // Here, a call would be made to a backend to save to Firestore.
    setAppState(AppState.Activated);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.Welcome:
        return <WelcomeScreen onBegin={handleBegin} />;
      case AppState.PathSelection:
        return <PathSelectionScreen onPathSelect={handlePathSelect} />;
      case AppState.InitialQuestions:
        const questions = userPath === 'artist' ? ARTIST_QUESTIONS : ENGINEER_QUESTIONS;
        const examples = userPath === 'artist' ? ARTIST_EXAMPLES : ENGINEER_EXAMPLES;
        return (
          <QuestionScreen
            key={`initial-${userPath}`}
            questions={questions}
            examples={examples}
            answers={initialAnswers}
            onAnswersChange={setInitialAnswers}
            onComplete={handleInitialAnswersComplete}
            userPath={userPath}
          />
        );
      case AppState.GeneratingDeepDive:
        const deepDiveLoadingMsg = userPath === 'artist'
            ? `Thank you, ${userName}. Your initial feelings are like the first brushstrokes on a canvas. Now, let's explore the colors. Generating some questions to bring your vision to life...`
            : `Thank you, ${userName}. Your initial thoughts are like the first sketch of a masterpiece. Now, let's add the details. Generating some questions to help you refine your blueprint...`;
        const deepDiveSecondaryMsg = userPath === 'artist'
            ? "There's no right or wrong way to create, only YOUR way."
            : "Remember, there's no right or wrong way to learn, only YOUR way.";
        return <LoadingScreen 
                    userPath={userPath}
                    message={deepDiveLoadingMsg}
                    secondaryMessage={deepDiveSecondaryMsg}
                />;
      case AppState.DeepDiveQuestions:
        const deepDiveQuestionObjects = deepDiveQuestions.map(q => ({ section: 'Deep Dive', text: q }));
        const deepDiveExamples = userPath === 'artist' ? ARTIST_EXAMPLES : ENGINEER_EXAMPLES;
        return (
          <QuestionScreen
            key={`deepdive-${userPath}`}
            questions={deepDiveQuestionObjects}
            examples={deepDiveExamples}
            answers={deepDiveAnswers}
            onAnswersChange={setDeepDiveAnswers}
            onComplete={handleDeepDiveAnswersComplete}
            userPath={userPath}
          />
        );
      case AppState.GeneratingCodex:
        const codexLoadingMsg = userPath === 'artist'
            ? "All the colors are here. We're now mixing them on your personal Artist's Palette. This may take a moment..."
            : "All the pieces are here. We're now assembling your personal Learning Blueprint. This may take a moment...";
        return <LoadingScreen userPath={userPath} message={codexLoadingMsg} />;
      case AppState.CodexDisplay:
        const codexTitle = userPath === 'artist' ? "Your Artist's Palette" : "Your Architect's Blueprint";
        const codexButton = userPath === 'artist' ? "[ Finalize My Palette ]" : "[ Finalize My Blueprint ]";
        return <CodexDisplayScreen userPath={userPath} title={codexTitle} buttonText={codexButton} codex={finalCodex} onActivate={handleActivate} />;
      case AppState.SoulSeedDisplay:
        const separator = '\n---\n';
        const codexWithoutSystemCommand = finalCodex.split(separator)[0].trim();
        return (
          <SoulSeedScreen
            userName={userName}
            codex={codexWithoutSystemCommand}
            userPath={userPath}
            onComplete={handleSoulSeedComplete}
          />
        );
      case AppState.Activated:
        const finalTitle = userPath === 'artist' ? "Palette Complete!" : "Blueprint Complete!";
        const finalMessage = userPath === 'artist' 
            ? "Your unique creative guide is ready. You can share it with collaborators, mentors, and friends."
            : "Your unique learning guide is ready. You can share it with teachers, parents, and collaborators.";
        return (
            <div className="text-center fade-in">
                <h1 className={`text-3xl font-serif mb-4 ${userPath === 'artist' ? 'text-purple-300' : 'text-teal-300'}`}>{finalTitle}</h1>
                <p className="text-lg text-gray-400">{finalMessage}</p>
            </div>
        );
      case AppState.Error:
          return (
            <div className="text-center fade-in text-red-400">
                <h1 className="text-2xl font-bold mb-4">An Error Occurred</h1>
                <p>{error}</p>
            </div>
          );
      default:
        return <WelcomeScreen onBegin={handleBegin} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-500">
      <header className="w-full max-w-2xl mx-auto">
        {appState !== AppState.Welcome && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleStartNew}
              className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Start a new codex"
            >
              Start New Codex
            </button>
          </div>
        )}
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;