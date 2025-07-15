"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTest } from '@/app/context/TestContext';

const distractorWords = ["เมฆ", "เก้าอี้", "ป่า", "กุญแจ", "รอยยิ้ม", "หนังสือ", "สุนัข"];

const DelayedRecallTask12 = () => {
  const { goToNextTask, updateScore, memorizedWords } = useTest();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mixedWords = useMemo(() => {
    const allWords = [...memorizedWords, ...distractorWords];
    return allWords.sort(() => Math.random() - 0.5); // Shuffle the words
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

  useEffect(() => {
    if (isSubmitted) {
        const timer = setTimeout(() => {
            goToNextTask();
        }, 2000); // Wait 2 seconds before moving to results
        return () => clearTimeout(timer);
    }
  }, [isSubmitted, goToNextTask]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-4">แบบทดสอบที่ 12: การระลึกคำล่าช้า</h1>
                <p className="text-lg mb-6">โปรดเลือกคำที่คุณจดจำได้จากรายการก่อนหน้านี้</p>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 my-8">
          {mixedWords.map(word => (
            <button
              key={word}
              onClick={() => handleWordSelection(word)}
              disabled={isSubmitted}
              className={`p-4 rounded-lg font-semibold text-lg transition-colors duration-200 ${
                selectedWords.includes(word)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 hover:bg-gray-300'
              } ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {word}
            </button>
          ))}
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="mt-8 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          >
            ส่งคำตอบ
          </button>
        ) : (
                    <p className="text-xl font-semibold text-green-700 mt-8">ขอบคุณครับ! คะแนนของคุณถูกบันทึกเรียบร้อยแล้ว</p>
        )}
      </div>
    </div>
  );
};

export default DelayedRecallTask12;
