"use client";

import { useState, useMemo } from 'react';
import { useTest } from '@/app/context/TestContext';
import { TaskNavigation } from '@/app/components/TaskNavigation';

const distractorWords = ["เมฆ","จักรยาน", "บ้าน", "ป่า", "กล้วย", "หน้าต่าง", "แม่น้ำ",];

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-4">แบบทดสอบที่ 12: จดจำคำศัพท์</h1>
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
            disabled={selectedWords.length === 0}
            className="mt-8 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            ส่งคำตอบ
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6 mt-8">
            <p className="text-xl font-semibold text-green-700">ขอบคุณครับ! คะแนนของคุณถูกบันทึกเรียบร้อยแล้ว</p>
            <TaskNavigation showBackButton={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DelayedRecallTask12;
