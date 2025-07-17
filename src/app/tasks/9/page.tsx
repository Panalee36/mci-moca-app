"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';
import clockImage from '../../img/clock/clock.png';

const ClockDrawingTask9 = () => {
  const { updateScore } = useTest();
  const [time, setTime] = useState({ hour: 12, minute: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);

  const targetTime = { hour: 11, minute: 10, text: 'สิบเอ็ดโมงสิบนาที (11:10)' };

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

  const handleReset = () => {
    setTime({ hour: 12, minute: 0 });
    setHasInteracted(false);
  };

  const handleSubmit = () => {
    const isCorrect = time.hour === targetTime.hour && time.minute === targetTime.minute;
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
            <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
          <TaskNavigation showBackButton={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">แบบทดสอบที่ 9: การวาดนาฬิกา</h2>
      <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> โปรดปรับเข็มนาฬิกาให้แสดงเวลา <strong>&quot;{targetTime.text}&quot;</strong></p>

      <div ref={clockRef} className="relative w-[400px] h-[400px] mx-auto bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${clockImage.src})` }}>
        {/* Hour Hand */}
        <div
          // FIX 1: ลบ class ที่เกี่ยวกับ transform ออก
          className="absolute top-1/2 left-1/2 w-2 h-[25%] origin-bottom cursor-pointer group"
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)` }}
          onMouseDown={() => { setDragging('hour'); setHasInteracted(true); }}
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
          onMouseDown={() => { setDragging('minute'); setHasInteracted(true); }}
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

      <div className="mt-8 flex justify-center gap-4">
        <button onClick={handleReset} className="px-8 py-3 bg-gray-300 text-black font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors">ตั้งค่าใหม่</button>
        <button onClick={handleSubmit} disabled={!hasInteracted} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">ส่งคำตอบ</button>
      </div>
    </div>
  );
};

export default ClockDrawingTask9;