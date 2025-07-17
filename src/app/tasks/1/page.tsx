"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

// Define the type for a single point
interface Point {
  label: string;
  x: number;
  y: number;
  id: number;
}

const VisuospatialTask1 = () => {
  const { updateScore } = useTest();
  const [score, setScore] = useState<number | null>(null);
  const [userPath, setUserPath] = useState<number[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [connections, setConnections] = useState<Array<{from: number, to: number}>>([]);

  // State to hold the randomly offset points
  const [points, setPoints] = useState<Point[]>([]);

  // Define the original base points with better mobile-friendly positioning
  const basePoints = useMemo(() => [
    {label: '1', x: 15, y: 15, id: 0},
    {label: 'ก', x: 50, y: 10, id: 1},
    {label: '2', x: 85, y: 20, id: 2},
    {label: 'ข', x: 15, y: 50, id: 3},
    {label: '3', x: 50, y: 45, id: 4},
    {label: 'ค', x: 85, y: 55, id: 5},
    {label: '4', x: 15, y: 85, id: 6},
    {label: 'ง', x: 50, y: 80, id: 7},
    {label: '5', x: 85, y: 90, id: 8},
  ], []);

  // Function to generate points with a random offset
  const generateOffsetPoints = useCallback((): Point[] => {
    // Generate small random offsets to make each test unique
    const maxOffset = 8; // Smaller offset for mobile
    
    return basePoints.map(point => ({
      ...point,
      x: point.x + (Math.random() - 0.5) * maxOffset,
      y: point.y + (Math.random() - 0.5) * maxOffset,
    }));
  }, [basePoints]);

  // Generate points on component mount
  useEffect(() => {
    setPoints(generateOffsetPoints());
  }, [generateOffsetPoints]);

  // Handle point click
  const handlePointClick = (pointId: number) => {
    if (score !== null) return; // Don't allow interaction after scoring
    
    if (selectedPoint === null) {
      // First click - select the point
      setSelectedPoint(pointId);
    } else if (selectedPoint === pointId) {
      // Clicking the same point - deselect
      setSelectedPoint(null);
    } else {
      // Second click - create connection
      const newConnection = { from: selectedPoint, to: pointId };
      setConnections(prev => [...prev, newConnection]);
      setUserPath(prev => {
        const newPath = [...prev];
        if (!newPath.includes(selectedPoint)) {
          newPath.push(selectedPoint);
        }
        if (!newPath.includes(pointId)) {
          newPath.push(pointId);
        }
        return newPath;
      });
      setSelectedPoint(null);
    }
  };

  // Reset function
  const resetTask = () => {
    setUserPath([]);
    setSelectedPoint(null);
    setConnections([]);
    setScore(null);
  };

  const checkAnswer = () => {
    // The correct sequence: 1 → ก → 2 → ข → 3 → ค → 4 → ง → 5
    const correctSequence = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // Check if connections follow the correct sequence
    const isCorrect = connections.length === 8 && 
      connections.every((conn, index) => {
        const expectedFrom = correctSequence[index];
        const expectedTo = correctSequence[index + 1];
        return conn.from === expectedFrom && conn.to === expectedTo;
      });
    
    const newScore = isCorrect ? 1 : 0;
    setScore(newScore);
    updateScore(1, newScore);
  };

  // Get point status for styling
  const getPointStatus = (pointId: number) => {
    if (selectedPoint === pointId) return 'selected';
    if (userPath.includes(pointId)) return 'connected';
    return 'default';
  };

  // Get point style classes
  const getPointClasses = (pointId: number) => {
    const status = getPointStatus(pointId);
    const baseClasses = 'w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center font-bold text-sm sm:text-base cursor-pointer transition-all duration-200 hover:scale-110';
    
    switch (status) {
      case 'selected':
        return `${baseClasses} bg-yellow-400 border-yellow-600 text-yellow-900 ring-2 ring-yellow-300`;
      case 'connected':
        return `${baseClasses} bg-blue-500 border-blue-600 text-white`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200`;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 1: การมองเห็นและบริหารจัดการ</h2>
      <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 mb-4 sm:mb-6 px-2">
        <strong>คำสั่ง:</strong> โปรดคลิกเลือกจุดต่างๆ ตามลำดับ สลับกัน โดยเริ่มจาก หมายเลข 1 → ตัวอักษร ก, ต่อด้วย หมายเลข 2 → ตัวอักษร ข, และดำเนินการเช่นนี้ไปเรื่อย ๆ จนถึง หมายเลข 5
      </p>

      {selectedPoint !== null && (
        <div className="text-center mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm sm:text-base text-yellow-800">
            <strong>เลือกแล้ว:</strong> {points.find(p => p.id === selectedPoint)?.label} - คลิกจุดถัดไปเพื่อเชื่อมต่อ
          </p>
        </div>
      )}

      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative w-full max-w-md h-64 sm:h-80 border-2 border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
          {points.map((point) => (
            <button
              key={point.id}
              onClick={() => handlePointClick(point.id)}
              className={getPointClasses(point.id)}
              style={{
                position: 'absolute',
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              disabled={score !== null}
            >
              {point.label}
            </button>
          ))}
          
          {/* Draw connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, index) => {
              const fromPoint = points.find(p => p.id === conn.from);
              const toPoint = points.find(p => p.id === conn.to);
              if (!fromPoint || !toPoint) return null;
              
              return (
                <line
                  key={index}
                  x1={`${fromPoint.x}%`}
                  y1={`${fromPoint.y}%`}
                  x2={`${toPoint.x}%`}
                  y2={`${toPoint.y}%`}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex gap-3 mb-4">
          <button
            onClick={checkAnswer}
            disabled={connections.length < 8 || score !== null}
            className="px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm sm:text-base"
          >
            บันทึกคำตอบ
          </button>
          
          <button
            onClick={resetTask}
            disabled={score !== null}
            className="px-6 sm:px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 disabled:bg-gray-400 transition-colors text-sm sm:text-base"
          >
            เริ่มใหม่
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            เชื่อมต่อแล้ว: {connections.length}/8 คู่
          </p>
        </div>

        {score !== null && (
          <div className="mt-4 sm:mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md">
            <p className="text-lg sm:text-xl font-bold">บันทึกคำตอบเรียบร้อย</p>
            <p className="text-sm sm:text-base">โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
        )}

        <TaskNavigation nextDisabled={score === null} showBackButton={false} />
      </div>
    </div>
  );
};

export default VisuospatialTask1;