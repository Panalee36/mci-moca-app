"use client";

import { useState } from 'react';
import { StaticImageData } from 'next/image';
import catImage from '../../img/cat/cat.png';
import chickenImage from '../../img/chicken/chicken.jpg';
import monkeyImage from '../../img/monkey/monkey.png';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';
import Image from 'next/image';

// Define the type for a single question
interface NamingQuestion {
  id: number;
  imageSrc: StaticImageData;
  question: string;
  options: string[];
  correctAnswer: string;
}

// Define the questions for the naming task
const questions: NamingQuestion[] = [
  {
    id: 1,
    imageSrc: catImage,
    question: 'นี่คือตัวอะไร',
    options: ['ควาย', 'แมว', 'หมา'],
    correctAnswer: 'แมว',
  },
  {
    id: 2,
    imageSrc: chickenImage,
    question: 'นี่คือตัวอะไร',
    options: ['ไก่', 'ช้าง', 'นก'],
    correctAnswer: 'ไก่',
  },
  {
    id: 3,
    imageSrc: monkeyImage,
    question: 'นี่คือตัวอะไร',
    options: ['ลิง', 'กบ', 'งู'],
    correctAnswer: 'ลิง',
  },
];

const NamingTask = () => {
  const { updateScore } = useTest();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);

  const handleOptionChange = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const checkAnswers = () => {
    let currentScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    updateScore(2, currentScore);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-blue-800 dark:text-blue-300 mb-4">แบบทดสอบที่ 2: ทายชื่อสัตว์</h2>
      <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 px-2">
        <strong>คำสั่ง:</strong> โปรดเลือกชื่อสัตว์ให้ตรงกับรูปภาพที่แสดง
      </p>

      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {questions.map(q => (
          <div key={q.id} className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex-shrink-0">
              <Image src={q.imageSrc} alt={`Animal ${q.id}`} width={300} height={200} className="rounded-md shadow-sm object-cover w-full max-w-xs sm:max-w-sm" />
            </div>
            <div className="w-full">
              <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center md:text-left">{q.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {q.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleOptionChange(q.id, option)}
                    className={`p-4 border rounded-lg text-center font-medium transition-colors ${answers[q.id] === option
                        ? 'bg-blue-500 text-white border-blue-500 ring-2 ring-blue-300 dark:bg-blue-600 dark:border-blue-500 dark:ring-blue-400'
                        : 'bg-white hover:bg-gray-100 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                      }`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col items-center gap-4 sm:gap-6">
        <button
          onClick={checkAnswers}
          className="px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm sm:text-base w-full sm:w-auto max-w-xs dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-600"
          disabled={Object.keys(answers).length !== questions.length || score !== null}
        >
          บันทึกคำตอบ
        </button>

        {score !== null && (
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center dark:bg-green-900/50 dark:border-green-400 dark:text-green-200">
            <p className="font-bold text-sm sm:text-base">บันทึกคำตอบเรียบร้อย</p>
            <p className="text-sm sm:text-base">โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
        )}

        <TaskNavigation nextDisabled={score === null} />
      </div>
    </div>
  );
};

export default NamingTask;
