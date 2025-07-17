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

  const getInterpretation = (score: number) => {
    if (score >= 26) {
      return {
        level: 'คะแนนอยู่ในเกณฑ์ปกติ',
        description: '26 – 30 คะแนน: ระดับการทำงานของสมองอยู่ในเกณฑ์ปกติ',
        color: 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200',
      };
    } if (score >= 18) {
      return {
        level: 'อาจมีความบกพร่องทางสติปัญญาระดับเล็กน้อยถึงปานกลาง',
        description: '18 – 25 คะแนน: ผู้สูงอายุที่มีคะแนนต่ำกว่า 26 อาจมีภาวะสมองเสื่อมเล็กน้อย (MCI)',
        color: 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-400 dark:text-yellow-200',
      };
    }
    return {
      level: 'มีความเสี่ยงต่อภาวะสมองเสื่อมหรือการถดถอยที่รุนแรง',
      description: 'ต่ำกว่า 18 คะแนน: ควรปรึกษาแพทย์เพื่อรับการประเมินอย่างละเอียด',
      color: 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-400 dark:text-red-200',
    };

  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg my-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 dark:text-blue-300 mb-6">ผลการทดสอบ MoCA</h1>

      <div className="mb-8 p-6 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-500 rounded-lg text-center">
        <p className="text-lg sm:text-xl text-blue-800 dark:text-blue-200">คะแนนรวมทั้งหมด</p>
        <p className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mt-2">{totalScore} / 30</p>
      </div>

      <div className={`mb-8 p-6 border-l-4 rounded-r-lg ${interpretation.color}`}>
        <h3 className="text-lg sm:text-xl font-bold">{interpretation.level}</h3>
        <p className="mt-2 text-base sm:text-lg">{interpretation.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">คะแนนรายข้อ</h2>
        {Object.entries(taskDetails).map(([taskNumber, details]) => {
          const score = scores[taskNumber] ?? 0;
          return (
            <div key={taskNumber} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">{details.name}</p>
              <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{score} / {details.max}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link href="/" passHref>
          <button
            onClick={resetTest}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors text-base sm:text-lg dark:bg-green-700 dark:hover:bg-green-600"
          >
            ทำแบบทดสอบอีกครั้ง
          </button>
        </Link>
      </div>

      <div className="mt-10 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-center text-gray-600 dark:text-gray-300">
        <p className="font-bold">ข้อควรทราบ:</p>
        <p className="text-sm sm:text-base">แบบทดสอบ MoCA ไม่ใช่เครื่องมือวินิจฉัยโดยตรง แต่ใช้สำหรับการคัดกรองเบื้องต้นเท่านั้น การประเมินผลที่แม่นยำควรทำโดยผู้เชี่ยวชาญทางการแพทย์</p>
      </div>
    </div>
  );
};

export default ResultsPage;
