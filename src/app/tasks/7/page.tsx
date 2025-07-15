"use client";

import { useState, useMemo } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

// จำนวนข้อที่ต้องการให้ตอบ
const QUESTION_COUNT = 5;

const SubtractionTask7 = () => {
  const { updateScore } = useTest();

  // --- ส่วนที่ 1: การสร้างโจทย์แบบสุ่ม ---
  // ใช้ useMemo เพื่อให้ค่าสุ่มถูกสร้างขึ้นเพียงครั้งเดียวเมื่อคอมโพเนนต์เริ่มทำงาน
  const quizData = useMemo(() => {
    // สุ่มเลขเริ่มต้นระหว่าง 60 ถึง 100
    const startNumber = Math.floor(Math.random() * 41) + 60;
    // สุ่มเลขสำหรับลบระหว่าง 6 ถึง 9
    const subtrahend = Math.floor(Math.random() * 4) + 6;

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
    // อนุญาตให้กรอกเฉพาะตัวเลข
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
    setIsSubmitted(true); // เปลี่ยนสถานะเป็น "ส่งคำตอบแล้ว"
  };

  return (
    // --- ส่วนที่ 2: ปรับปรุงดีไซน์ (UI/UX) ---
    // ใช้พื้นหลังสีอ่อน (slate-50) เพื่อลดแสงจ้า และเพิ่ม padding (p-8)
    <div className="w-full max-w-3xl mx-auto p-8 bg-slate-50 rounded-3xl shadow-lg">
      <div className="text-center">
        {/* เพิ่มขนาดหัวข้อเป็น 3xl และใช้สีเข้มขึ้นเพื่อความชัดเจน */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🧠 แบบทดสอบที่ 7: ฝึกสมาธิ
        </h2>
        {/* เพิ่มขนาดคำสั่งเป็น xl และใช้ประโยคที่เข้าใจง่ายขึ้น */}
        <p className="text-xl text-gray-700 mb-8">
          <strong>คำสั่ง:</strong> เริ่มจากตัวเลขที่กำหนดให้ แล้วลบออกตามจำนวนไปเรื่อยๆ ให้ครบทุกช่อง
        </p>
      </div>

      {/* --- ส่วนแสดงโจทย์และช่องกรอกคำตอบ --- */}
      <div className="flex flex-col items-center gap-6 mb-10">
        {/* แสดงเลขเริ่มต้นในกล่องที่เด่นชัด */}
        <div className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-md">
          <p className="text-lg">เลขเริ่มต้น</p>
          <p className="text-5xl font-bold">{quizData.startNumber}</p>
        </div>

        {/* วนลูปสร้างช่องกรอกคำตอบ */}
        <div className="flex flex-col gap-5 w-full max-w-sm">
          {userAnswers.map((answer, index) => {
            // ตรวจสอบว่าคำตอบถูกหรือผิด (เมื่อผู้ใช้กดตรวจคำตอบแล้ว)
            // const isCorrect = parseInt(answer, 10) === quizData.correctAnswers[index];
            
            // กำหนดสไตล์ของกรอบตามผลลัพธ์
            // ลบเงื่อนไข isSubmitted ออก เพื่อไม่ให้แสดงผลทันที
            const resultStyle = 'border-gray-300'; 

            return (
              <div key={index} className="flex items-center justify-center gap-4">
                {/* แสดงตัวเลขก่อนหน้า หรือเลขเริ่มต้นสำหรับข้อแรก */}
                <span className="text-3xl font-semibold text-gray-500 w-16 text-right">
                  {index === 0 ? quizData.startNumber : userAnswers[index - 1] || '...'}
                </span>
                {/* แสดงเครื่องหมายและตัวเลขที่ต้องลบให้ชัดเจน */}
                <span className="text-3xl font-bold text-red-500">
                  - {quizData.subtrahend}
                </span>
                <span className="text-3xl font-bold text-gray-600">=</span>
                <input
                  type="text"
                  inputMode="numeric" // แสดงแป้นพิมพ์ตัวเลขบนมือถือ
                  value={answer}
                  onChange={e => handleAnswerChange(index, e.target.value)}
                  disabled={isSubmitted} // ปิดการแก้ไขหลังส่งคำตอบ
                  // เพิ่มขนาดช่องกรอก, ตัวอักษร และปรับปรุงสไตล์
                  className={`w-32 p-4 border-2 ${resultStyle} rounded-lg text-4xl text-center font-bold focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all`}
                  placeholder="?"
                />
                {/* ซ่อนไอคอนถูก/ผิด หลังตรวจคำตอบ */}
                {/* {isSubmitted && (
                  <span className="text-3xl w-8">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                )} */}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- ส่วนแสดงปุ่มและผลลัพธ์ --- */}
      <div className="text-center">
        {!isSubmitted ? (
          // แสดงปุ่ม "ตรวจคำตอบ" ก่อนส่ง
          <button
            onClick={checkAnswers}
            // ปรับขนาดปุ่มให้ใหญ่และกดง่าย
            className="px-10 py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={userAnswers.some(a => a === '')} // ปิดปุ่มถ้ายังกรอกไม่ครบ
          >
            ตรวจคำตอบ
          </button>
        ) : (
          // แสดงข้อความและปุ่ม "ถัดไป" หลังส่งคำตอบแล้ว
          <div className="mt-6 flex flex-col items-center gap-6">
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-lg w-full max-w-md text-center">
              <p className="font-bold text-lg">บันทึกคำตอบเรียบร้อย 👍</p>
              <p className="text-base">กดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไปได้เลย</p>
            </div>
            <TaskNavigation />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtractionTask7;