"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
// 1. นำเข้า List คำศัพท์ทั้งหมดจากไฟล์ JSON
import fullWordList from './thai-wordlist.json';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

// 2. สร้าง Array ของพยัญชนะไทยสำหรับใช้ในการสุ่มโจทย์
const CONSONANTS = [
  'ก'
];

const LanguageTask8 = () => {
  const { updateScore } = useTest();

  // 3. สร้าง State สำหรับเก็บตัวอักษรที่เป็นโจทย์ในแต่ละรอบ
  const [targetLetter, setTargetLetter] = useState('');

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [text, setText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [correctWordCount, setCorrectWordCount] = useState(0);

  // 4. สร้าง Set ของคำศัพท์จากไฟล์ JSON เพื่อการค้นหาที่รวดเร็ว
  // useMemo จะช่วยให้การสร้าง Set นี้ทำงานเพียงครั้งเดียว แม้ component จะ re-render ก็ตาม
  const dictionarySet = useMemo(() => new Set(fullWordList), []);

  const checkAnswers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const userWords = text.split(/[\s\n]+/).filter(word => word.trim().length > 0);

    const validWords = userWords.filter(word =>
      word.startsWith(targetLetter) && dictionarySet.has(word)
    );

    const uniqueValidWordsCount = new Set(validWords).size;
    setCorrectWordCount(uniqueValidWordsCount);

    const finalScore = uniqueValidWordsCount >= 11 ? 1 : 0;
    setScore(finalScore);
    updateScore(8, finalScore);
  };

  // 5. สุ่มตัวอักษรโจทย์เมื่อคอมโพเนนต์โหลดขึ้นมาครั้งแรก
  useEffect(() => {
    const randomLetter = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    setTargetLetter(randomLetter);
  }, []); // [] หมายถึงให้ Effect นี้ทำงานแค่ครั้งเดียวตอน Mount

  // Timer effect
  useEffect(() => {
    if (isStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted]);

  // Answer checking effect
  useEffect(() => {
    if (timeLeft === 0 && isStarted && score === null) {
      checkAnswers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isStarted, score]);

  const startTest = () => {
    setIsStarted(true);
  };

  if (!targetLetter) {
    return <div className="text-center p-8 dark:text-gray-300">กำลังเตรียมโจทย์...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">แบบทดสอบ: ภาษา - การสร้างคำ</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        <strong>คำสั่ง:</strong> โปรดบอกชื่อคำนามที่ขึ้นต้นด้วยตัวอักษร <strong>&quot;{targetLetter}&quot;</strong> ให้ได้มากที่สุดภายใน 1 นาที
      </p>

      {!isStarted ? (
        <button onClick={startTest} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
          เริ่มจับเวลา
        </button>
      ) : score === null ? (
        <div>
          <div className="text-4xl font-bold text-red-600 dark:text-red-500 mb-6">{timeLeft} วินาที</div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
            placeholder={`พิมพ์คำที่ขึ้นต้นด้วย "${targetLetter}" ที่นี่...`}
            disabled={timeLeft === 0}
          />
          <button
            onClick={checkAnswers}
            className="mt-4 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 dark:bg-green-700 dark:hover:bg-green-600 dark:disabled:bg-gray-500"
            disabled={timeLeft === 0}
          >
            ตรวจคำตอบ
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-6">
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center dark:bg-green-900/50 dark:border-green-400 dark:text-green-200">
            <p className="font-bold">หมดเวลา!</p>
            <p>คุณตอบคำที่ถูกต้องและไม่ซ้ำกันได้ {correctWordCount} คำ</p>
            <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
          <TaskNavigation showBackButton={false} />
        </div>
      )}
    </div>
  );
};

export default LanguageTask8;