"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTest } from '../../context/TestContext';


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


const AttentionTask6 = () => {
  const { updateScore, goToNextTask } = useTest();
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0); // Correct taps on '1'
  const [errors, setErrors] = useState(0); // Incorrect taps on non-'1' numbers
  const [isFinished, setIsFinished] = useState(false);

  const tappedForCurrentIndex = useRef(false);

  // useRef สำหรับเก็บ timer เพื่อให้เราสามารถเคลียร์มันได้จากที่อื่น
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // This useEffect handles the timer for the number sequence.
  useEffect(() => {
    // Stop the timer if the test is finished or the sequence is complete.
    if (isFinished || index >= numberSequence.length) {
      return;
    }

    // Set a timer to advance to the next number.
    timerRef.current = setTimeout(() => {
      setIndex(prev => prev + 1);
      tappedForCurrentIndex.current = false; // Reset for the new number.
    }, 2000);

    // Cleanup function to clear the timer.
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index, isFinished]);

  // This useEffect handles the logic for when the test ends.
  const calculateScore = useCallback(() => {
    // Give 1 point if the first tap is correct (hits = 1) and there are no errors.
    if (hits === 1 && errors === 0) {
      return 1;
    }
    return 0;
  }, [hits, errors]);

  // This useEffect handles the logic for when the test ends.
  useEffect(() => {
    const testShouldEnd = index >= numberSequence.length;

    if (isFinished || testShouldEnd) {
      // Ensure isFinished is set if the sequence ends.
      if (testShouldEnd && !isFinished) {
        setIsFinished(true);
        return; // Allow re-render to trigger the final logic.
      }

      // Clear any lingering timer when the test is officially over.
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const finalScore = calculateScore();
      updateScore(6, finalScore);
      console.log("Test finished!");
      console.log(`Final Score: ${finalScore}`);
      console.log(`Correct Hits: ${hits}`);
      console.log(`Errors (taps on non-1): ${errors}`);

      // Navigate after a short delay.
      setTimeout(() => {
        goToNextTask();
      }, 1500);
    }
  }, [isFinished, index, hits, errors, updateScore, goToNextTask, calculateScore]);

  const handleTap = useCallback(() => {
    if (tappedForCurrentIndex.current || isFinished) {
      return;
    }
    tappedForCurrentIndex.current = true;

    const currentNumber = numberSequence[index];

    if (currentNumber === 1) {
      setHits(prev => prev + 1);
      // End the task on the first correct tap.
      setIsFinished(true);
    } else {
      setErrors(prev => prev + 1);
    }
  }, [isFinished, index]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">แบบทดสอบที่ 6: กดปุ่มเมื่อเจอเลขเป้าหมาย</h2>

      {!isFinished ? (
        <div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 px-2">
            <strong>คำสั่ง:</strong> โปรดกดปุ่มทุกครั้งที่เห็นหมายเลข <strong>1</strong>
          </p>
          <div className="h-32 sm:h-40 lg:h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 sm:mb-6">
            <p className="text-5xl sm:text-6xl lg:text-8xl font-bold text-gray-800 dark:text-gray-200">
              {numberSequence[index]}
            </p>
          </div>
          <button
            onClick={handleTap}
            className="w-full p-4 sm:p-5 lg:p-6 bg-blue-600 text-white font-bold text-lg sm:text-xl lg:text-2xl rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            กดที่นี่
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200 rounded-lg w-full max-w-md text-center">
            <p className="font-bold text-sm sm:text-base">การทดสอบสิ้นสุดแล้ว</p>
            <p className="text-sm sm:text-base">กำลังไปข้อต่อไป...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttentionTask6;