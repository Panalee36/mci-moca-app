"use client";

import { useState, useEffect } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

const orientationItems = [
  { id: 'date', label: 'วันที่' },
  { id: 'month', label: 'เดือน' },
  { id: 'year', label: 'ปี' },
  { id: 'day', label: 'วันในสัปดาห์' },
  { id: 'season', label: 'ฤดู' },
  { id: 'timeOfDay', label: 'ช่วงเวลาของวัน' },
];

const OrientationTask13 = () => {
  const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const currentBEYear = new Date().getFullYear() + 543;
  const years = Array.from({ length: 21 }, (_, i) => (currentBEYear - 10 + i).toString());
  const seasons = ['ฤดูฝน', 'ฤดูหนาว', 'ฤดูร้อน'];
  const timesOfDay = ['ตอนเช้า', 'ตอนบ่าย', 'ตอนเย็น'];

  const { updateScore } = useTest();
  const [answers, setAnswers] = useState(Array(6).fill(''));
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentDate, setCurrentDate] = useState({ date: '', month: '', year: '', day: '', season: '', timeOfDay: '' });

  useEffect(() => {
    const today = new Date();
    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const getThaiSeason = (date: Date) => {
      const month = date.getMonth(); // 0-11
      const dayOfMonth = date.getDate();

      // Winter: Mid-October to Mid-February
      if ((month === 9 && dayOfMonth >= 16) || month === 10 || month === 11 || month === 0 || (month === 1 && dayOfMonth <= 15)) {
        return 'ฤดูหนาว';
      }
      // Summer: Mid-February to Mid-May
      if ((month === 1 && dayOfMonth >= 16) || month === 2 || month === 3 || (month === 4 && dayOfMonth <= 15)) {
        return 'ฤดูร้อน';
      }
      // Rainy Season: Mid-May to Mid-October
      return 'ฤดูฝน';
    };

    const getTimeOfDay = (date: Date) => {
      const hour = date.getHours();
      if (hour < 12) return 'ตอนเช้า';
      if (hour < 18) return 'ตอนบ่าย';
      return 'ตอนเย็น';
    };

    setCurrentDate({
      date: today.getDate().toString(),
      month: thaiMonths[today.getMonth()],
      year: (today.getFullYear() + 543).toString(), // Buddhist Era year
      day: thaiDays[today.getDay()],
      season: getThaiSeason(today),
      timeOfDay: getTimeOfDay(today),
    });
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setIsCompleted(newAnswers.every(answer => answer !== ''));
  };

  const calculateScore = () => {
    let score = 0;
    const [dateAns, monthAns, yearAns, dayAns, seasonAns, timeOfDayAns] = answers;

    // Scoring based on matching current date information
    if (yearAns.trim() === currentDate.year) {
      score++;
    }
    if (monthAns.trim() === currentDate.month) {
      score++;
    }
    if (dateAns.trim() === currentDate.date) {
      score++;
    }
    if (dayAns.trim() === currentDate.day) {
      score++;
    }
    if (seasonAns.trim() === currentDate.season) {
      score++;
    }
    if (timeOfDayAns.trim() === currentDate.timeOfDay) {
      score++;
    }

    return score;
  };



  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 13: การรับรู้ - วัน-เวลา ฤดูกาล</h2>
      <p className="text-lg text-center text-gray-700 mb-6">
        <strong>คำสั่ง:</strong> โปรดกรอกข้อมูลเกี่ยวกับวันและเวลาปัจจุบันให้ถูกต้อง
      </p>

      <div className="space-y-4">
        {orientationItems.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label htmlFor={item.id} className="text-lg font-medium text-gray-800">{item.label}</label>
                        <select
              id={item.id}
              value={answers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">เลือก...</option>
              {item.id === 'date' && days.map(d => <option key={d} value={d}>{d}</option>)}
              {item.id === 'month' && thaiMonths.map(m => <option key={m} value={m}>{m}</option>)}
              {item.id === 'year' && years.map(y => <option key={y} value={y}>{y}</option>)}
              {item.id === 'day' && thaiDays.map(d => <option key={d} value={d}>{d}</option>)}
              {item.id === 'season' && seasons.map(s => <option key={s} value={s}>{s}</option>)}
              {item.id === 'timeOfDay' && timesOfDay.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
      </div>

            <div className="mt-8 flex flex-col items-center gap-6">

                <TaskNavigation onFinish={() => updateScore(13, calculateScore())} nextDisabled={!isCompleted} />
      </div>
    </div>
  );
};

export default OrientationTask13;
