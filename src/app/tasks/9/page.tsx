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

  const calculateAngle = useCallback((clientX: number, clientY: number) => {
    if (!clockRef.current) return 0;
    
    const clock = clockRef.current;
    const rect = clock.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // คำนวณมุมโดยให้ 0 องศาอยู่ที่ด้านบน (12 นาฬิกา)
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
    return (angle + 360) % 360;
  }, []);

  const updateTimeFromAngle = useCallback((angle: number) => {
    if (dragging === 'minute') {
      const minute = Math.floor(angle / 6); // ใช้ floor เพื่อความแม่นยำ
      setTime(prev => ({ ...prev, minute }));
    } else if (dragging === 'hour') {
      // ✅ FIX 2: ใช้ Math.floor เพื่อให้ได้ค่า 0-11 ที่แน่นอน
      let hour = Math.floor(angle / 30);
      if (hour === 0) {
        // ถ้าผลลัพธ์เป็น 0 (โซน 12 นาฬิกา) ให้เปลี่ยนเป็น 12
        hour = 12;
      }
      setTime(prev => ({ ...prev, hour }));
    }
  }, [dragging]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const angle = calculateAngle(e.clientX, e.clientY);
    updateTimeFromAngle(angle);
  }, [dragging, calculateAngle, updateTimeFromAngle]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging) return;
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const angle = calculateAngle(touch.clientX, touch.clientY);
    updateTimeFromAngle(angle);
  }, [dragging, calculateAngle, updateTimeFromAngle]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleReset = () => {
    setTime({ hour: 12, minute: 0 });
    setHasInteracted(false);
  };

  const handleSubmit = () => {
    const isCorrect = time.hour === targetTime.hour && time.minute === targetTime.minute;
    updateScore(9, isCorrect ? 3 : 0);
    setIsFinished(true);
  };

  // การคำนวณมุมสำหรับแสดงผลยังคงถูกต้อง
  const hourAngle = (time.hour % 12) * 30 + time.minute * 0.5;
  const minuteAngle = time.minute * 6;

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800 mb-4">แบบทดสอบที่ 9: การวาดนาฬิกา</h2>
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-4 sm:gap-6">
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center">
            <p className="font-bold text-base sm:text-lg">บันทึกคำตอบเรียบร้อย</p>
            <p className="text-sm sm:text-base">โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
          <TaskNavigation showBackButton={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg text-center">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800 mb-4">แบบทดสอบที่ 9: การวาดนาฬิกา</h2>
      <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6 px-2"><strong>คำสั่ง:</strong> โปรดปรับเข็มนาฬิกาให้แสดงเวลา <strong>&quot;{targetTime.text}&quot;</strong></p>

      <div ref={clockRef} className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${clockImage.src})` }}>
        {/* Hour Hand */}
        <div
          // FIX 1: ลบ class ที่เกี่ยวกับ transform ออก
          className="absolute top-1/2 left-1/2 w-2 h-[25%] origin-bottom cursor-pointer group"
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)`, touchAction: 'none' }}
          onMouseDown={() => { setDragging('hour'); setHasInteracted(true); }}
          onTouchStart={(e) => { e.preventDefault(); setDragging('hour'); setHasInteracted(true); }}
        >
          <div className="w-full h-full bg-black rounded-t-full" />
          {/* Hitbox area */}
          <div className="absolute top-0 left-1/2 w-12 h-12 bg-transparent transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Minute Hand */}
        <div
          // ✅ FIX 1: ลบ class ที่เกี่ยวกับ transform ออก
          className="absolute top-1/2 left-1/2 w-1.5 h-[40%] origin-bottom cursor-pointer group"
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)`, touchAction: 'none' }}
          onMouseDown={() => { setDragging('minute'); setHasInteracted(true); }}
          onTouchStart={(e) => { e.preventDefault(); setDragging('minute'); setHasInteracted(true); }}
        >
          <div className="w-full h-full bg-black rounded-t-full" />
          {/* Hitbox area */}
          <div className="absolute top-0 left-1/2 w-12 h-12 bg-transparent transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="mt-6 sm:mt-8">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">เวลาที่ตั้ง: {String(time.hour).padStart(2, '0')}:{String(time.minute).padStart(2, '0')}</p>
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button 
          onClick={handleReset} 
          className="px-6 sm:px-8 py-3 bg-gray-300 text-black font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          ตั้งค่าใหม่
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={!hasInteracted} 
          className="px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
        >
          บันทึกคำตอบ
        </button>
      </div>
    </div>
  );
};

export default ClockDrawingTask9;