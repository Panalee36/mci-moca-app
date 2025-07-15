"use client";

import { useTest } from '../context/TestContext';
import Link from 'next/link';

interface TaskNavigationProps {
  onNext?: () => void; // Optional callback for when the next button is clicked
  onFinish?: () => void; // Optional callback for the final task
  nextDisabled?: boolean;
}

export const TaskNavigation = ({ onNext, onFinish, nextDisabled = false }: TaskNavigationProps) => {
  const { currentTask, goToNextTask, goToPreviousTask } = useTest();

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
    <div className="mt-10 flex justify-between w-full">
      <button
        onClick={goToPreviousTask}
                disabled={currentTask <= 1}
        className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
      >
        ย้อนกลับ
      </button>
            <button
          onClick={handleNext}
          disabled={nextDisabled}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
                              {currentTask >= 13 ? 'เสร็จสิ้นการทดสอบ' : 'งานถัดไป'}
        </button>

    </div>
  );
};
