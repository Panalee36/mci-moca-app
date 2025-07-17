"use client";

import { useState, useMemo } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

// จำนวนข้อที่ต้องการให้ตอบ
const QUESTION_COUNT = 5;

const SubtractionTask7 = () => {
  const { updateScore } = useTest();

  const quizData = useMemo(() => {
    const startNumber = 100;
    const subtrahend = 7;
    const correctAnswers = [];
    let currentNumber = startNumber;
    for (let i = 0; i < QUESTION_COUNT; i++) {
      currentNumber -= subtrahend;
      correctAnswers.push(currentNumber);
    }
    return { startNumber, subtrahend, correctAnswers };
  }, []);

  const [userAnswers, setUserAnswers] = useState(Array(QUESTION_COUNT).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value.replace(/[^0-9]/g, '');
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (parseInt(answer, 10) === quizData.correctAnswers[index]) {
        correctCount++;
      }
    });

    let finalScore = 0;
    if (correctCount >= 2 && correctCount <= 3) {
      finalScore = 2;
    } else if (correctCount >= 4) {
      finalScore = 3;
    }

    updateScore(7, finalScore);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-gray-800 rounded-3xl shadow-lg">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          แบบทดสอบที่ 7: ลบตัวเลข
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 px-2">
          <strong>คำสั่ง:</strong> เริ่มจากตัวเลขที่กำหนดให้ แล้วลบออกตามจำนวนไปเรื่อยๆ ให้ครบทุกช่อง
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-blue-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl shadow-md dark:bg-blue-700">
          <p className="text-sm sm:text-base lg:text-lg">เลขเริ่มต้น</p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">{quizData.startNumber}</p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 w-full max-w-sm">
          {userAnswers.map((answer, index) => {
            const resultStyle = 'border-gray-300 dark:border-gray-600';

            return (
              <div key={index} className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-500 dark:text-gray-400 w-12 sm:w-14 lg:w-16 text-right">
                  {index === 0 ? quizData.startNumber : userAnswers[index - 1] || '...'}
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-red-500 dark:text-red-400">
                  - {quizData.subtrahend}
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-600 dark:text-gray-300">=</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={answer}
                  onChange={e => handleAnswerChange(index, e.target.value)}
                  disabled={isSubmitted}
                  className={`w-20 sm:w-24 lg:w-28 xl:w-32 p-2 sm:p-3 lg:p-4 border-2 ${resultStyle} rounded-lg text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-center font-bold focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500`}
                  placeholder="?"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        {!isSubmitted ? (
          <button
            onClick={checkAnswers}
            className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg lg:text-xl font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-500"
            disabled={userAnswers.some(a => a === '')}
          >
            บันทึกคำตอบ
          </button>
        ) : (
          <div className="mt-4 sm:mt-6 flex flex-col items-center gap-4 sm:gap-6">
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-lg w-full max-w-md text-center dark:bg-green-900/50 dark:border-green-400 dark:text-green-200">
              <p className="font-bold text-base sm:text-lg">บันทึกคำตอบเรียบร้อย</p>
              <p className="text-sm sm:text-base">กดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไปได้เลย</p>
            </div>
            <TaskNavigation showBackButton={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtractionTask7;