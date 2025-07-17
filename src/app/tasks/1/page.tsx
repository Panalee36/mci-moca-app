"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';

// Define the type for a single point
interface Point {
  label: string;
  x: number;
  y: number;
}

const VisuospatialTask1 = () => {
  const { updateScore } = useTest();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number | null>(null);
  const [userPath, setUserPath] = useState<number[]>([]);
  const isDrawing = useRef(false);

  // State to hold the randomly offset points
  const [points, setPoints] = useState<Point[]>([]);

  // Canvas dimensions
  const canvasWidth = 700;
  const canvasHeight = 400;

  // Define padding so points don't appear too close to the edges
  const padding = 30; // Reduced padding slightly to allow more offset range

  // Define the original base points
  const basePoints = useMemo(() => [
    {label: '1', x: 80, y: 80},
    {label: 'ก', x: 180, y: 60},
    {label: '2', x: 280, y: 90},
    {label: 'ข', x: 380, y: 60},
    {label: '3', x: 480, y: 100},
    {label: 'ค', x: 580, y: 90},
    {label: '4', x: 450, y: 250},
    {label: 'ง', x: 300, y: 300},
    {label: '5', x: 150, y: 250},
  ], []); // Use useMemo to prevent redefinition on every render

  // Function to generate points with a random offset
  const generateOffsetPoints = useCallback((): Point[] => {
    // Find the min/max x and y of the base points to calculate the bounding box
    const minX = Math.min(...basePoints.map(p => p.x));
    const maxX = Math.max(...basePoints.map(p => p.x));
    const minY = Math.min(...basePoints.map(p => p.y));
    const maxY = Math.max(...basePoints.map(p => p.y));

    // Calculate the width and height occupied by the base points
    const pointsWidth = maxX - minX;
    const pointsHeight = maxY - minY;

    // Calculate the maximum possible offset to keep all points within the canvas
    // and respect the padding
    const maxOffsetX = canvasWidth - pointsWidth - 2 * padding;
    const maxOffsetY = canvasHeight - pointsHeight - 2 * padding;

    // Generate random offsets for X and Y
    // Ensure the offset is at least 'padding - minX/minY' so the leftmost/topmost point
    // is at least 'padding' from the edge.
    const offsetX = Math.random() * Math.max(0, maxOffsetX) + padding - minX;
    const offsetY = Math.random() * Math.max(0, maxOffsetY) + padding - minY;
    
    // Apply the same offset to all base points
    return basePoints.map(p => ({
      ...p,
      x: p.x + offsetX,
      y: p.y + offsetY,
    }));
  }, [basePoints, canvasWidth, canvasHeight, padding]); // Dependencies for useCallback

  useEffect(() => {
    // Generate new points with a random offset whenever the component mounts
    setPoints(generateOffsetPoints());
  }, [generateOffsetPoints]); // Re-run when generateOffsetPoints changes (which it won't with no external deps)

  const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw points
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 22, 0, 2 * Math.PI);
      ctx.fillStyle = '#e1f5fe';
      ctx.fill();
      ctx.strokeStyle = '#4fc3f7';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#0277bd';
      ctx.font = 'bold 18px Noto_Sans_Thai, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.label, p.x, p.y);
    });

    // Draw user path
    if (userPath.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#00acc1';
      ctx.lineWidth = 4;
      const startPoint = points[userPath[0]];
      ctx.moveTo(startPoint.x, startPoint.y);
      for (let i = 1; i < userPath.length; i++) {
        const point = points[userPath[i]];
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }
  }, [points, userPath]); // Dependencies for useCallback

  useEffect(() => {
    if (points.length > 0) { // Ensure points are generated before drawing
      draw(); // Initial draw
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (score !== null) return; // Don't allow drawing after submission
      isDrawing.current = true;
      const pos = getMousePos(canvas, e);
      let clickedPointIndex = -1;
      points.forEach((p, index) => {
        const dist = Math.hypot(p.x - pos.x, p.y - pos.y);
        if (dist < 22) {
          clickedPointIndex = index;
        }
      });
      if (clickedPointIndex !== -1) {
        setUserPath([clickedPointIndex]);
      } else {
        setUserPath([]);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current || score !== null) return;
      const pos = getMousePos(canvas, e);
      points.forEach((p, index) => {
        const dist = Math.hypot(p.x - pos.x, p.y - pos.y);
        if (dist < 22 && !userPath.includes(index)) {
          setUserPath(prevPath => [...prevPath, index]);
        }
      });
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [points, draw, score, userPath]);

  const checkAnswer = () => {
    // The correctPath still refers to the original conceptual order of labels (indices)
    // as the relative positions are maintained by the offset.
    const correctPath = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const isCorrect = userPath.length === correctPath.length &&
      userPath.every((val, index) => val === correctPath[index]);
    const newScore = isCorrect ? 1 : 0;
    setScore(newScore);
    updateScore(1, newScore);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 1: การมองเห็นและบริหารจัดการ</h2>
      <p className="text-lg text-center text-gray-700 mb-6">
        <strong>คำสั่ง:</strong> โปรดลากเส้นเชื่อมต่อระหว่างตัวเลขและตัวอักษรตามลำดับสลับกันไป เริ่มจาก 1 ไปยัง ก, 2 ไปยัง ข, และต่อไปเรื่อยๆ จนสิ้นสุดที่หมายเลข 5
      </p>

      <div className="canvas-container flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
        />
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={checkAnswer}
          disabled={userPath.length < 9 || score !== null}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          บันทึกคำตอบ
        </button>

        {score !== null && (
          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md">
            <p className="text-xl font-bold">บันทึกคำตอบเรียบร้อย</p>
            <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
          </div>
        )}

        <TaskNavigation nextDisabled={score === null} />
      </div>
    </div>
  );
};

export default VisuospatialTask1;