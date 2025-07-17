"use client";

import { useState, useMemo } from 'react';
import { useTest } from '@/app/context/TestContext';
import { TaskNavigation } from '@/app/components/TaskNavigation';

const distractorWords = ["เมฆ", "จักรยาน", "บ้าน", "ป่า", "กล้วย", "หน้าต่าง", "แม่น้ำ",];

const DelayedRecallTask12 = () => {
  const { updateScore, memorizedWords } = useTest();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mixedWords = useMemo(() => {
    // Combine and deduplicate words using a Set
    const uniqueWords = Array.from(new Set([...memorizedWords, ...distractorWords]));
    // Shuffle the unique words
    return uniqueWords.sort(() => Math.random() - 0.5);
  }, [memorizedWords]);

  const handleWordSelection = (word: string) => {
    if (isSubmitted) return;

    setSelectedWords(prevSelected =>
      prevSelected.includes(word)
        ? prevSelected.filter(w => w !== word)
        : [...prevSelected, word]
    );
  };

  const handleSubmit = () => {
    let score = 0;
    for (const word of selectedWords) {
      if (memorizedWords.includes(word)) {
        score++;
      }
    }

    updateScore(12, score);
    setIsSubmitted(true);
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">แบบทดสอบที่ 12: จดจำคำศัพท์</h1>
        <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 px-2 text-gray-700 dark:text-gray-300">โปรดเลือกคำที่คุณจดจำได้จากรายการก่อนหน้านี้</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 my-6 sm:my-8">
          {mixedWords.map(word => (
            <button
              key={word}
              onClick={() => handleWordSelection(word)}
              disabled={isSubmitted}
              className={`p-3 sm:p-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-colors duration-200 ${selectedWords.includes(word)
                  ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:hover:bg-blue-400'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                } ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {word}
            </button>
          ))}
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedWords.length === 0}
            className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto dark:bg-green-700 dark:hover:bg-green-600 dark:disabled:bg-gray-500"
          >
            บันทึกคำตอบ
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-green-700 dark:text-green-400">คำตอบของคุณถูกบันทึกเรียบร้อยแล้ว</p>
            <TaskNavigation showBackButton={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DelayedRecallTask12;
