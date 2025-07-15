"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface TestContextType {
  scores: Record<string, number>;
  updateScore: (taskId: number, score: number) => void;
  goToNextTask: () => void;
  goToPreviousTask: () => void;
  currentTask: number;
  totalScore: number;
  memorizedWords: string[];
  setMemorizedWords: (words: string[]) => void;
  resetTest: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [memorizedWords, setMemorizedWordsState] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const match = pathname.match(/\/tasks\/(\d+)/);
    if (match) {
      setCurrentTask(parseInt(match[1], 10));
    }
  }, [pathname]);

  const updateScore = (taskId: number, score: number) => {
    setScores(prevScores => ({
      ...prevScores,
      [taskId]: score,
    }));
  };

  const setMemorizedWords = (words: string[]) => {
    setMemorizedWordsState(words);
  };

  const goToNextTask = () => {
    const nextTaskId = currentTask + 1;
    if (nextTaskId <= 13) { // 13 tasks in total
      router.push(`/tasks/${nextTaskId}`);
    } else {
      router.push('/results');
    }
  };

  const goToPreviousTask = () => {
    const prevTaskId = currentTask - 1;
    if (prevTaskId >= 1) {
      router.push(`/tasks/${prevTaskId}`);
    }
  };

  const resetTest = () => {
    setScores({});
    setMemorizedWordsState([]);
    setCurrentTask(1);
    router.push('/');
  };

  const totalScore = Object.values(scores).reduce((acc, score) => acc + score, 0);

  return (
    <TestContext.Provider value={{ scores, updateScore, goToNextTask, goToPreviousTask, currentTask, totalScore, memorizedWords, setMemorizedWords, resetTest }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
