"use client";

import { useState, useEffect, useRef } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

// Generate a sequence of 30 numbers, with a few '1's
const generateSequence = () => {
  const seq = [];
  const onesPositions = [3, 7, 12, 18, 25]; // Example positions for '1'
  for (let i = 0; i < 30; i++) {
    if (onesPositions.includes(i)) {
      seq.push(1);
    } else {
      seq.push(Math.floor(Math.random() * 8) + 2); // Random number from 2-9
    }
  }
  return seq;
};

const numberSequence = generateSequence();
// ไม่ต้องใช้ totalOnes แล้ว เพราะเราจะจบเมื่อเจอ 1 ครั้งแรก
// const totalOnes = numberSequence.filter(n => n === 1).length;

const AttentionTask6 = () => {
  const { updateScore } = useTest();
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0); // hits ยังคงมีอยู่เผื่ออนาคต หรือเพื่อการแสดงผลเบื้องต้น
  const [misses, setMisses] = useState(0); // misses ยังคงมีอยู่เผื่ออนาคต
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const tappedForCurrentIndex = useRef(false);

  // useRef สำหรับเก็บ timer เพื่อให้เราสามารถเคลียร์มันได้จากที่อื่น
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // ตราบใดที่ยังไม่จบการทดสอบและยังไม่แสดงครบทุกตัว
    if (index < numberSequence.length && !isFinished) {
      timerRef.current = setTimeout(() => {
        setIndex(prev => prev + 1);
        tappedForCurrentIndex.current = false; // รีเซ็ตสถานะการแตะเมื่อตัวเลขเปลี่ยน
      }, 2500); // แสดงแต่ละตัวเลข 2.5 วินาที (2500 มิลลิวินาที)
      
      // Cleanup function: เคลียร์ timer เมื่อ component unmount หรือ index เปลี่ยน
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else if (index >= numberSequence.length && !isFinished) { // ถ้าลำดับหมดแล้วและยังไม่จบ
      // กรณีนี้เกิดขึ้นถ้าเลข 1 ไม่ปรากฏเลย หรือผู้ใช้ไม่กดเลข 1 เลยจนจบ 30 ตัว
      setIsFinished(true);
    }
  }, [index, isFinished]); // เพิ่ม isFinished ใน dependency array

  const handleTap = () => {
    // ป้องกันการแตะหลายครั้งสำหรับตัวเลขเดียวกัน
    if (tappedForCurrentIndex.current || isFinished) {
        console.log("Already tapped for this number or test finished.");
        return;
    } 

    if (numberSequence[index] === 1) {
      setHits(prev => prev + 1);
      console.log("Hit! Found 1 and ended the test.");

      // *** เมื่อเจอ 1 และกดได้ ให้จบแบบทดสอบทันที ***
      if (timerRef.current) { // เคลียร์ timer เพื่อหยุดการเปลี่ยนเลข
        clearTimeout(timerRef.current);
      }
      setIsFinished(true); // ตั้งค่าให้แบบทดสอบจบ
      
    } else {
      setMisses(prev => prev + 1);
      console.log("Miss! Tapped on a non-1 number.");
    }
    tappedForCurrentIndex.current = true; // ตั้งค่าว่ามีการแตะแล้วสำหรับตัวเลขปัจจุบัน
  };

  const calculateScore = () => {
    // ในโจทย์ใหม่นี้ คะแนนอาจจะเรียบง่ายขึ้น: 1 ถ้ากด 1 ได้ถูกต้อง, 0 ถ้าไม่
    // หรือถ้าไม่ต้องการให้จบเร็ว อาจจะคำนวณตามเดิม
    // แต่ถ้าจบเมื่อเจอ 1 ครั้งแรก ก็แค่เช็คว่า hits เป็น 1 หรือไม่
    const finalScore = hits > 0 ? 1 : 0; // ถ้ากด 1 ได้อย่างน้อย 1 ครั้ง (ก็คือครั้งแรกนั่นเอง) ให้ได้ 1 คะแนน
    return finalScore;
  };

  useEffect(() => {
    if (isFinished) {
      const finalScore = calculateScore();
      setScore(finalScore);
      updateScore(6, finalScore);
      console.log("Test finished! Final Score:", finalScore);
      console.log("Hits:", hits, "Misses:", misses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, hits]); // เพิ่ม hits ใน dependency array เพื่อให้ calculateScore อัปเดตถูกต้อง

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
            <p>โปรดกดปุ่ม "ถัดไป" เพื่อทำแบบทดสอบข้อต่อไป</p>
            {score !== null && (
                <p className="mt-2 text-lg">คะแนนของคุณ: {score === 1 ? 'ผ่าน' : 'ไม่ผ่าน'}</p>
            )}
          </div>
          <TaskNavigation />
        </div>
      )}
    </div>
  );
};

export default AttentionTask6;