"use client";

import { useTest } from '../context/TestContext';
import Link from 'next/link';

const taskDetails = {
  1: { name: "การมองเห็นและบริหารจัดการ - ลากเส้นต่อจุดตามลำดับ", max: 1 },
  2: { name: "การเรียกชื่อ - บอกชื่อสัตว์", max: 3 },
  3: { name: "การมองเห็นและบริหารจัดการ - เกมลากเส้นต่อจุด", max: 1 },
  4: { name: "ความจำ - การจำคำ (ไม่มีคะแนนในส่วนนี้)", max: 0 },
  5: { name: "ความตั้งใจ - การจำตัวเลขถอยหลัง", max: 2 },
  6: { name: "ความตั้งใจ - การเคาะเมื่อได้ยินเลขเป้าหมาย", max: 1 },
  7: { name: "ความตั้งใจ - การลบเลขต่อเนื่อง", max: 3 },
  8: { name: "ภาษา - การบอกคำตามหมวดอักษร", max: 1 },
  9: { name: "ภาษา - การวาดนาฬิกา", max: 3 },
  10: { name: "ภาษา - การพูดซ้ำประโยค", max: 2 },
  11: { name: "ความคิดรวบยอด - การเชื่อมโยงคำ", max: 2 },
  12: { name: "ความจำ - การระลึกคำล่าช้า", max: 5 },
  13: { name: "การรับรู้ - วัน-เวลา สถานที่", max: 6 }
};

const ResultsPage = () => {
  const { scores, resetTest } = useTest();

  const totalScore = Object.values(scores).reduce((sum, score) => (sum || 0) + (score || 0), 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg my-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">ผลการทดสอบ MoCA</h1>

      <div className="mb-8 p-6 bg-blue-100 border-2 border-blue-300 rounded-lg text-center">
        <p className="text-xl text-blue-800">คะแนนรวมทั้งหมด</p>
        <p className="text-5xl font-bold text-blue-600 mt-2">{totalScore} / 30</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">คะแนนรายข้อ</h2>
        {Object.entries(taskDetails).map(([taskNumber, details]) => {
                    const score = scores[taskNumber] ?? 0;
          return (
            <div key={taskNumber} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
              <p className="font-medium text-gray-700">{details.name}</p>
              <p className="font-bold text-lg text-gray-900">{score} / {details.max}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link href="/" passHref>
          <button
            onClick={resetTest}
            className="px-10 py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors text-lg"
          >
            ทำแบบทดสอบอีกครั้ง
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
