"use client";

import { useTest } from '../context/TestContext';


interface TaskNavigationProps {
  onNext?: () => void; // Optional callback for when the next button is clicked
  onFinish?: () => void; // Optional callback for the final task
  nextDisabled?: boolean;
}

export const TaskNavigation = ({ onNext, onFinish, nextDisabled = false }: TaskNavigationProps) => {
  const { currentTask, goToNextTask } = useTest();

  const handleNext = () => {
    if (onFinish) {
      onFinish();
    }
    if (onNext) {
      onNext();
    }
    goToNextTask();
  };

  return (
    <div className="mt-8 w-full flex flex-col sm:flex-row sm:justify-center sm:gap-4 gap-3">
      <button
        onClick={handleNext}
        disabled={nextDisabled}
        className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-2 sm:order-2 dark:bg-green-700 dark:hover:bg-green-600 dark:disabled:bg-gray-600"
      >
        {currentTask >= 13 ? 'เสร็จสิ้นการทดสอบ' : 'ถัดไป'}
      </button>
    </div>
  );
};
