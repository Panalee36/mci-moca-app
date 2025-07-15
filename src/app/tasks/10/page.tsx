"use client";

import { useState, useEffect } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

const sentenceTasks = [
  {
    sentence: 'ฉันรู้แต่ว่าคุณจอนเป็นคนเดียวที่จะมาช่วยงานนี้',
    options: [
      'คุณจอนเป็นคนเดียวที่ทำงานนี้เสร็จ',
      'ฉันรู้แต่ว่าคุณจอนเป็นคนเดียวที่จะมาช่วยงานนี้',
      'ฉันไม่รู้ว่าใครจะมาช่วยงานนี้',
    ],
    answer: 'ฉันรู้แต่ว่าคุณจอนเป็นคนเดียวที่จะมาช่วยงานนี้',
  },
  {
    sentence: 'แมวซ่อนอยู่ใต้โซฟาเสมอเมื่อมีหมาอยู่ในห้อง',
    options: [
      'แมวซ่อนอยู่ใต้โซฟาเสมอเมื่อมีหมาอยู่ในห้อง',
      'หมาชอบไล่แมวที่อยู่บนโซฟา',
      'แมวกับหมาเป็นเพื่อนกันในห้อง',
    ],
    answer: 'แมวซ่อนอยู่ใต้โซฟาเสมอเมื่อมีหมาอยู่ในห้อง',
  }
];

const SentenceRepetitionTask10 = () => {
  const { updateScore } = useTest();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [phase, setPhase] = useState('memorize'); // 'memorize', 'select'
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (phase === 'memorize' && !isFinished) {
      setTimeLeft(15);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('select');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentTaskIndex, phase, isFinished]);

  useEffect(() => {
    if (isFinished) {
      updateScore(10, score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === sentenceTasks[currentTaskIndex].answer) {
      setScore(prev => prev + 1);
    }

    if (currentTaskIndex < sentenceTasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setPhase('memorize');
    } else {
      setIsFinished(true);
    }
  };

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

    const currentTask = sentenceTasks[currentTaskIndex];

    if (phase === 'memorize') {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4"><strong>คำสั่ง:</strong> โปรดจดจำประโยคต่อไปนี้ภายใน 15 วินาที</p>
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-2xl font-semibold text-gray-800">{currentTask.sentence}</p>
          </div>
          <p className="text-xl font-bold text-red-600 mt-6">เหลือเวลาอีก: {timeLeft} วินาที</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> โปรดเลือกประโยคที่ท่านได้เห็นก่อนหน้านี้</p>
        <div className="grid grid-cols-1 gap-4">
          {currentTask.options.map(option => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full px-4 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg text-left"
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
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 10: ภาษา - การจำประโยค</h2>
      {renderContent()}
    </div>
  );
};

export default SentenceRepetitionTask10;
