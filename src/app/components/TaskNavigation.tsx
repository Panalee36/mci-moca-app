"use client";

import { useTest } from '../context/TestContext';


interface TaskNavigationProps {
  onNext?: () => void; // Optional callback for when the next button is clicked
  onFinish?: () => void; // Optional callback for the final task
  nextDisabled?: boolean;
  showBackButton?: boolean;
}

export const TaskNavigation = ({ onNext, onFinish, nextDisabled = false, showBackButton = true }: TaskNavigationProps) => {
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
    <div className={`mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-0 ${showBackButton ? 'sm:justify-between' : 'sm:justify-end'} w-full`}>
      {showBackButton && (
        <button
          onClick={goToPreviousTask}
          disabled={currentTask <= 1}
          className="px-4 sm:px-6 py-3 sm:py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-2 sm:order-1"
        >
          ย้อนกลับ
        </button>
      )}
      <button
        onClick={handleNext}
        disabled={nextDisabled}
        className="px-4 sm:px-6 py-3 sm:py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base order-1 sm:order-2"
      >
        {currentTask >= 13 ? 'เสร็จสิ้นการทดสอบ' : 'ถัดไป'}
      </button>
    </div>
  );
};
