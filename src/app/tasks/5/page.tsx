"use client";

import { useState, useEffect } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

const trials = [
  { id: 'forward', sequence: '2 1 8 5 4', instruction: 'กรุณาพิมพ์ลำดับตัวเลขที่คุณเพิ่งเห็น โดยพิมพ์ให้เป็นลำดับ “ย้อนกลับ”', correctAnswer: '45812' },
  { id: 'backward', sequence: '7 4 2', instruction: 'กรุณาพิมพ์ลำดับตัวเลขที่คุณเพิ่งเห็น โดยพิมพ์ให้เป็นลำดับ “ย้อนกลับ”', correctAnswer: '247' },
];

const AttentionTask5 = () => {
  const { updateScore } = useTest();
  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<'viewing' | 'recalling' | 'finished'>('viewing');
  const [userInput, setUserInput] = useState('');
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    if (phase === 'viewing') {
      const timer = setTimeout(() => setPhase('recalling'), 5000); // Show numbers for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [phase, trialIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.replace(/[^\d]/g, '').split('').join(' ');
    setUserInput(formatted);
  };

  const checkAnswer = () => {
    const cleanedInput = userInput.replace(/\s+/g, '');
    const currentTrial = trials[trialIndex];
    const newScore = cleanedInput === currentTrial.correctAnswer ? 1 : 0;
    const updatedScores = [...scores, newScore];
    setScores(updatedScores);

    if (trialIndex < trials.length - 1) {
      setTrialIndex(trialIndex + 1);
      setUserInput('');
      setPhase('viewing');
    } else {
      const totalScore = updatedScores.reduce((a, b) => a + b, 0);
      updateScore(5, totalScore);
      setPhase('finished');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 5: การจำตัวเลข</h2>
      <p className="text-lg text-center text-gray-600 mb-4">รอบที่ {trialIndex + 1} / {trials.length}</p>

      {phase === 'viewing' && (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> โปรดจดจำลำดับตัวเลขต่อไปนี้</p>
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-4xl font-bold tracking-widest text-gray-800">{trials[trialIndex].sequence}</p>
          </div>
          <p className="mt-4 text-sm text-gray-500">หน้าจอจะเปลี่ยนโดยอัตโนมัติ...</p>
        </div>
      )}

      {phase === 'recalling' && (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> {trials[trialIndex].instruction}</p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-2xl text-center tracking-widest focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="เช่น 1 2 3 4 5"
          />
          <button
            onClick={checkAnswer}
            disabled={!userInput.trim()}
            className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            บันทึกคำตอบ
          </button>
        </div>
      )}

      {phase === 'finished' && (
        <div className="text-center flex flex-col items-center gap-6">
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md text-center">
            <p className="font-bold">บันทึกคำตอบเรียบร้อย</p>
            <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
          <TaskNavigation showBackButton={false} />
        </div>
      )}
    </div>
  );
};

export default AttentionTask5;
