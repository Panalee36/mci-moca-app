"use client";

import { useState } from 'react';
import { StaticImageData } from 'next/image';
import lionImage from '../../img/animal/lion.jpg';
import rhinocerosImage from '../../img/animal/rhinoceros.jpg';
import camelImage from '../../img/animal/camel.jpg';
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
    imageSrc: lionImage,
    question: 'นี่คือตัวอะไร',
    options: ['สิงโต', 'เสือ', 'แมว'],
    correctAnswer: 'สิงโต',
  },
  {
    id: 2,
    imageSrc: rhinocerosImage,
    question: 'นี่คือตัวอะไร',
    options: ['แรด', 'ช้าง', 'ฮิปโป'],
    correctAnswer: 'แรด',
  },
  {
    id: 3,
    imageSrc: camelImage,
    question: 'นี่คือตัวอะไร',
    options: ['ม้า', 'อูฐ', 'ลา'],
    correctAnswer: 'อูฐ',
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
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 2: การเรียกชื่อสัตว์</h2>
      <p className="text-lg text-center text-gray-700 mb-8">
        <strong>คำสั่ง:</strong> โปรดเลือกชื่อสัตว์ให้ตรงกับรูปภาพที่แสดง
      </p>

      <div className="space-y-10">
        {questions.map(q => (
          <div key={q.id} className="flex flex-col md:flex-row items-center gap-8 p-6 border border-gray-200 rounded-lg">
            <Image src={q.imageSrc} alt={`Animal ${q.id}`} width={300} height={200} className="rounded-md shadow-sm object-cover" />
            <div className="w-full">
              <p className="text-xl font-semibold text-gray-800 mb-4">{q.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q.options.map(option => (
                  <button 
                    key={option} 
                    onClick={() => handleOptionChange(q.id, option)}
                    className={`p-4 border rounded-lg text-center font-medium transition-colors ${
                      answers[q.id] === option 
                        ? 'bg-blue-500 text-white border-blue-500 ring-2 ring-blue-300'
                        : 'bg-white hover:bg-gray-100 border-gray-300'
                    }`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

            <div className="mt-10 flex flex-col items-center gap-6">
        <button 
          onClick={checkAnswers}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          disabled={Object.keys(answers).length !== questions.length || score !== null}
        >
          ตรวจสอบคำตอบ
        </button>

        {score !== null && (
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center">
            <p className="font-bold">บันทึกคำตอบเรียบร้อย</p>
            <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
        )}

        <TaskNavigation nextDisabled={score === null} />
      </div>
    </div>
  );
};

export default NamingTask;
