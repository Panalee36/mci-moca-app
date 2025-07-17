"use client";

import { useState, useEffect, useRef } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

// Generate a sequence of 30 numbers with exactly three '1's at random positions.
const generateSequence = () => {
  // Create an array of 27 random numbers (2-9)
  const nonOnes = Array.from({ length: 27 }, () => Math.floor(Math.random() * 8) + 2);
  // Create an array with three '1's
  const ones = [1, 1, 1];
  // Combine them
  const seq = [...nonOnes, ...ones];

  // Shuffle the array to randomize the positions of '1's
  for (let i = seq.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [seq[i], seq[j]] = [seq[j], seq[i]];
  }

  return seq;
};

const numberSequence = generateSequence();
const totalOnes = 3; // We have exactly 3 ones in the sequence.

const AttentionTask6 = () => {
  const { updateScore } = useTest();
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0); // Correct taps on '1'
  const [errors, setErrors] = useState(0); // Incorrect taps on non-'1' numbers
  const [isFinished, setIsFinished] = useState(false);

  const tappedForCurrentIndex = useRef(false);

  // useRef สำหรับเก็บ timer เพื่อให้เราสามารถเคลียร์มันได้จากที่อื่น
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // ตราบใดที่ยังไม่จบการทดสอบและยังไม่แสดงครบทุกตัว
    if (index < numberSequence.length && !isFinished) {
      timerRef.current = setTimeout(() => {
        // Move to the next number
        setIndex(prev => prev + 1);
        tappedForCurrentIndex.current = false; // Reset tap status for the new number
      }, 2000); // Display each number for 1 second (1000 ms)

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else if (index >= numberSequence.length && !isFinished) {
      // The sequence is over, finish the test.
      setIsFinished(true);
    }
  }, [index, isFinished]); // เพิ่ม isFinished ใน dependency array

  const handleTap = () => {
    // ป้องกันการแตะหลายครั้งสำหรับตัวเลขเดียวกัน
    if (tappedForCurrentIndex.current || isFinished) {
        console.log("Already tapped for this number or test finished.");
        return;
    } 

    const currentNumber = numberSequence[index];

    if (currentNumber === 1) {
      setHits(prev => prev + 1);
      console.log(`Hit! Correctly tapped on 1. Total hits: ${hits + 1}`);
    } else {
      setErrors(prev => prev + 1);
      console.log(`Error! Tapped on ${currentNumber}. Total errors: ${errors + 1}`);
    }
    tappedForCurrentIndex.current = true; // ตั้งค่าว่ามีการแตะแล้วสำหรับตัวเลขปัจจุบัน
  };

  const calculateScore = () => {
    // ให้ 1 คะแนนถ้าตอบถูกทั้งหมด (hits = 3) และไม่มีข้อผิดพลาด (errors = 0)
    if (hits === totalOnes && errors === 0) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    if (isFinished) {
      const finalScore = calculateScore();
      updateScore(6, finalScore);
      console.log("Test finished!");
      console.log(`Final Score: ${finalScore}`);
      console.log(`Correct Hits: ${hits}`);
      console.log(`Errors (taps on non-1): ${errors}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">แบบทดสอบที่ 6: สมาธิ - การเคาะเมื่อเจอเลขเป้าหมาย</h2>

      {!isFinished ? (
        <div>
          <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> โปรดกดปุ่มทุกครั้งที่เห็นหมายเลข <strong>1</strong></p>
          <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-6">
            <p className="text-8xl font-bold text-gray-800">{numberSequence[index]}</p>
          </div>
          <button
            onClick={handleTap}
            className="w-full p-6 bg-blue-600 text-white font-bold text-2xl rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            กดที่นี่
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center">
            <p className="font-bold">การทดสอบสิ้นสุดแล้ว</p>
            <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
          <TaskNavigation showBackButton={false} />
        </div>
      )}
    </div>
  );
};

export default AttentionTask6;