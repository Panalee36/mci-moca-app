"use client";

import { useEffect, useState } from 'react';
import { useTest } from '@/app/context/TestContext';
import { useRouter } from 'next/navigation';

const wordsToMemorize = ["จักรยาน", "บ้าน", "กล้วย", "หน้าต่าง", "แม่น้ำ"];

const MemoryTask4 = () => {
    const { updateScore, setMemorizedWords } = useTest();
  const [acknowledged, setAcknowledged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Store the words in the context for the recall task
    setMemorizedWords(wordsToMemorize);
    // Update score to mark this task as "completed" for navigation logic
    updateScore(4, 0); 
  }, [setMemorizedWords, updateScore]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 text-blue-800 dark:text-blue-300">แบบทดสอบที่ 4: จดจำคำ</h1>
        <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 text-gray-700 dark:text-gray-300 px-2">โปรดจดจำรายการคำต่อไปนี้ จะต้องใช้ในการทดสอบภายหลัง</p>
        <div className="bg-blue-50 dark:bg-blue-900/50 p-4 sm:p-6 rounded-lg shadow-inner mb-6 sm:mb-8">
          <ul className="text-lg sm:text-xl lg:text-2xl space-y-2 text-blue-800 dark:text-blue-300 font-semibold">
            {wordsToMemorize.map(word => <li key={word}>{word}</li>)}
          </ul>
        </div>
        <div className="mt-6 sm:mt-8">
          <button
            onClick={() => {
              setAcknowledged(true);
              router.push('/tasks/5');
            }}
            disabled={acknowledged}
            className="px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-150 ease-in-out text-sm sm:text-base w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-500 dark:focus:ring-blue-400"
          >
            ฉันจำได้แล้ว
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryTask4;
