"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';
import clockImage from '../../img/clock/clock.png';

const ClockDrawingTask9 = () => {
  const { updateScore } = useTest();
  // เริ่มต้นเวลาที่ 10:10 ตามโจทย์เพื่อให้ผู้ใช้เห็นภาพเริ่มต้น
  const [time, setTime] = useState({ hour: 10, minute: 10 });
  const [isFinished, setIsFinished] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !clockRef.current) return;

    const clock = clockRef.current;
    const rect = clock.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // คำนวณมุมโดยให้ 0 องศาอยู่ที่ด้านบน (12 นาฬิกา)
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90;
    const normalizedAngle = (angle + 360) % 360;

    if (dragging === 'minute') {
      const minute = Math.floor(normalizedAngle / 6); // ใช้ floor เพื่อความแม่นยำ
      setTime(prev => ({ ...prev, minute }));
    } else if (dragging === 'hour') {
      // ✅ FIX 2: ใช้ Math.floor เพื่อให้ได้ค่า 0-11 ที่แน่นอน
      let hour = Math.floor(normalizedAngle / 30);
      if (hour === 0) {
        // ถ้าผลลัพธ์เป็น 0 (โซน 12 นาฬิกา) ให้เปลี่ยนเป็น 12
        hour = 12;
      }
      setTime(prev => ({ ...prev, hour }));
    }
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const handleSubmit = () => {
    // Target time is 10:10
    const isCorrect = time.hour === 10 && time.minute === 10;
    updateScore(9, isCorrect ? 1 : 0);
    setIsFinished(true);
  };

  // การคำนวณมุมสำหรับแสดงผลยังคงถูกต้อง
  const hourAngle = (time.hour % 12) * 30 + time.minute * 0.5;
  const minuteAngle = time.minute * 6;

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">แบบทดสอบที่ 9: การวาดนาฬิกา</h2>
        <div className="mt-6 flex flex-col items-center gap-6">
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center">
            <p className="font-bold">บันทึกคำตอบเรียบร้อย</p>
            <p>โปรดกดปุ่ม "ถัดไป" เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
          <TaskNavigation />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">แบบทดสอบที่ 9: การวาดนาฬิกา</h2>
      <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> โปรดปรับเข็มนาฬิกาให้แสดงเวลา <strong>10 โมง 10 นาที (10:10)</strong></p>
      
      <div ref={clockRef} className="relative w-[400px] h-[400px] mx-auto bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${clockImage.src})` }}>
        {/* Hour Hand */}
        <div
          // ✅ FIX 1: ลบ class ที่เกี่ยวกับ transform ออก
          className="absolute top-1/2 left-1/2 w-2 h-[25%] origin-bottom cursor-pointer group"
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)` }}
          onMouseDown={() => setDragging('hour')}
        >
          <div className="w-full h-full bg-black rounded-t-full" />
          {/* Hitbox area */}
          <div className="absolute top-0 left-1/2 w-8 h-8 bg-transparent transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Minute Hand */}
        <div
          // ✅ FIX 1: ลบ class ที่เกี่ยวกับ transform ออก
          className="absolute top-1/2 left-1/2 w-1.5 h-[40%] origin-bottom cursor-pointer group"
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)` }}
          onMouseDown={() => setDragging('minute')}
        >
          <div className="w-full h-full bg-black rounded-t-full" />
          {/* Hitbox area */}
          <div className="absolute top-0 left-1/2 w-8 h-8 bg-transparent transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="mt-8">
        <p className="text-2xl font-bold text-blue-700">เวลาที่ตั้ง: {String(time.hour).padStart(2, '0')}:{String(time.minute).padStart(2, '0')}</p>
      </div>

      <div className="mt-8 flex justify-center">
        <button onClick={handleSubmit} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">ส่งคำตอบ</button>
      </div>
    </div>
  );
};

export default ClockDrawingTask9;