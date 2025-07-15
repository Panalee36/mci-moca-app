"use client";

import { useState, useEffect } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

const wordPairs = [
  { pair: ['กล้วย', 'ส้ม'], options: ['ผลไม้', 'ของหวาน', 'สีเหลือง'], answer: 'ผลไม้' },
  { pair: ['รถไฟ', 'จักรยาน'], options: ['ยานพาหนะ', 'ของเล่น', 'เหล็ก'], answer: 'ยานพาหนะ' }
];

const AbstractionTask11 = () => {
  const { updateScore } = useTest();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === wordPairs[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < wordPairs.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  useEffect(() => {
    if (isFinished) {
      updateScore(11, score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const renderContent = () => {
    if (isFinished) {
      return (
        <div className="text-center flex flex-col items-center gap-6">
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center">
            <p className="font-bold">การทดสอบสิ้นสุดแล้ว</p>
            <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
          <TaskNavigation />
        </div>
      );
    }

    const currentQuestion = wordPairs[currentQuestionIndex];

    return (
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-4"><strong>คำสั่ง:</strong> โปรดเลือกคำที่อธิบายความสัมพันธ์ของคำคู่ต่อไปนี้</p>
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-8">
          <p className="text-3xl font-bold text-gray-800">{currentQuestion.pair.join(' - ')}</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map(option => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-xl"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 11: ความคิดรวบยอด - การเชื่อมโยงคำ</h2>
      {renderContent()}
    </div>
  );
};

export default AbstractionTask11;
