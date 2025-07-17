"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';
import Image from 'next/image';
import square2dImage from '../../img/drawing/square.jpg';

// --- ค่าคงที่สำหรับ Dot Game ---
const GRID_SIZE = 10;
const DOT_SPACING = 40;
const CANVAS_OFFSET = 50;

// ค่าที่ปรับปรุงสำหรับผู้สูงอายุ: จุดใหญ่ขึ้น, คลิกง่ายขึ้น, เส้นหนาขึ้น
const DOT_RADIUS = 10;
const ACTIVE_DOT_RADIUS = 12;
const DOT_DETECTION_RADIUS = 30;
const LINE_WIDTH = 4;

// ไม่จำเป็นต้องใช้ CORRECT_SHAPE_LINES อีกต่อไปในเวอร์ชันนี้
// เพราะเราจะไม่เปรียบเทียบรูปทรงที่ถูกต้องแล้ว

const DrawingTask3 = () => {
    const { theme } = useTheme();
    const { updateScore } = useTest();
    const [phase, setPhase] = useState<'viewing' | 'drawing' | 'finished'>('viewing');

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [dots, setDots] = useState<Array<{ x: number; y: number }>>([]);
    const [drawnLines, setDrawnLines] = useState<Array<{ from: number; to: number }>>([]);
    const [activeDotIndex, setActiveDotIndex] = useState<number | null>(null);

    useEffect(() => {
        const generatedDots = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                generatedDots.push({
                    x: col * DOT_SPACING + CANVAS_OFFSET,
                    y: row * DOT_SPACING + CANVAS_OFFSET
                });
            }
        }
        setDots(generatedDots);
    }, []);

    useEffect(() => {
        if (phase === 'viewing') {
            const timer = setTimeout(() => setPhase('drawing'), 15000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    const getMousePos = useCallback((canvas: HTMLCanvasElement, evt: MouseEvent | React.MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY,
        };
    }, []);

    const getTouchPos = useCallback((canvas: HTMLCanvasElement, evt: TouchEvent | React.TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touch = evt.touches[0] || evt.changedTouches[0];
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
        };
    }, []);

    const getNearestDotIndex = useCallback((x: number, y: number) => {
        let nearestDotIndex: number | null = null;
        let minDistance = Infinity;

        dots.forEach((dot, index) => {
            const dist = Math.sqrt(Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2));
            if (dist < minDistance && dist < DOT_DETECTION_RADIUS) {
                minDistance = dist;
                nearestDotIndex = index;
            }
        });
        return nearestDotIndex;
    }, [dots]);

    const drawLine = useCallback((x1: number, y1: number, x2: number, y2: number, color: string = '#333', lineWidth: number = LINE_WIDTH) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isDarkMode = theme === 'dark';
        const dotColor = isDarkMode ? '#6B7280' : '#999';
        const activeDotColor = isDarkMode ? '#60A5FA' : 'blue';
        const lineColor = isDarkMode ? '#E5E7EB' : '#333';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (phase === 'drawing') {
            dots.forEach((dot, index) => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = dotColor;
                ctx.fill();

                if (activeDotIndex === index) {
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, ACTIVE_DOT_RADIUS, 0, Math.PI * 2);
                    ctx.fillStyle = activeDotColor;
                    ctx.fill();
                }
            });

            drawnLines.forEach(line => {
                const fromDot = dots[line.from];
                const toDot = dots[line.to];
                if (fromDot && toDot) {
                    drawLine(fromDot.x, fromDot.y, toDot.x, toDot.y, lineColor);
                }
            });
        }
    }, [phase, dots, drawnLines, activeDotIndex, drawLine, theme]);

    const handleInteraction = useCallback((pos: { x: number, y: number }) => {
        if (phase !== 'drawing') return;

        const clickedDotIndex = getNearestDotIndex(pos.x, pos.y);

        if (clickedDotIndex !== null) {
            if (activeDotIndex === null) {
                setActiveDotIndex(clickedDotIndex);
            } else {
                const newLine = { from: activeDotIndex, to: clickedDotIndex };

                const isDuplicate = drawnLines.some(line =>
                    (line.from === newLine.from && line.to === newLine.to) ||
                    (line.from === newLine.to && line.to === newLine.from)
                );

                if (!isDuplicate && newLine.from !== newLine.to) {
                    setDrawnLines(prevLines => [...prevLines, newLine]);
                }
                setActiveDotIndex(null);
            }
        } else {
            setActiveDotIndex(null);
        }
    }, [getNearestDotIndex, activeDotIndex, drawnLines, phase]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.button !== 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const pos = getMousePos(canvas, e);
        handleInteraction(pos);
    }, [getMousePos, handleInteraction]);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const pos = getTouchPos(canvas, e);
        handleInteraction(pos);
    }, [getTouchPos, handleInteraction]);

    const clearCanvas = useCallback(() => {
        setDrawnLines([]);
        setActiveDotIndex(null);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        }
    }, []);

    const submitDrawing = useCallback(() => {
        const newScore = drawnLines.length > 0 ? 1 : 0;
        updateScore(3, newScore);
        setPhase('finished');
    }, [drawnLines, updateScore]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-blue-800 dark:text-blue-300 mb-4">แบบทดสอบที่ 3: การวาดรูป</h2>
            <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 px-2"><strong>คำสั่ง:</strong> ดูรูปต่อไปนี้ให้ดี แล้วจำไว้ เพื่อที่จะวาดตามในขั้นตอนต่อไป</p>
            {phase === 'viewing' && (
                <div className="text-center">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6"><strong>คำสั่ง:</strong> โปรดจดจำภาพสี่เหลี่ยมนี้ คุณมีเวลา 15 วินาที</p>
                    <div className="flex justify-center mb-4">
                        <Image
                            src={square2dImage}
                            alt="2D Square Example"
                            width={400}
                            height={400}
                            className="rounded-lg shadow-md max-w-full h-auto w-64 sm:w-80 lg:w-96"
                        />
                    </div>
                    <p className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">หน้าจอจะเปลี่ยนโดยอัตโนมัติเมื่อหมดเวลา...</p>
                </div>
            )}

            {phase === 'drawing' && (
                <div className="text-center">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6"><strong>คำสั่ง:</strong> เริ่มจาดจุดไหนก่อนก็ได้โดยการเชื่อมจุดตามรูปที่เห็นก่อนหน้านี้</p>
                    <div className="flex justify-center mb-4 sm:mb-6 overflow-x-auto">
                        <canvas
                            ref={canvasRef}
                            width={GRID_SIZE * DOT_SPACING + 2 * CANVAS_OFFSET}
                            height={GRID_SIZE * DOT_SPACING + 2 * CANVAS_OFFSET}
                            className="border-2 sm:border-4 border-blue-400 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 cursor-crosshair shadow-lg max-w-full h-auto"
                            style={{ minWidth: '320px', touchAction: 'none' }}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
                        <button
                            onClick={clearCanvas}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base w-full sm:w-auto dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
                        >
                            ล้างทั้งหมด
                        </button>
                        <button
                            onClick={submitDrawing}
                            disabled={drawnLines.length === 0}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base w-full sm:w-auto dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-500"
                        >
                            บันทึกคำตอบ
                        </button>
                    </div>
                </div>
            )}

            {phase === 'finished' && (
                <div className="text-center flex flex-col items-center gap-4 sm:gap-6">
                    <div className="mt-4 sm:mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md dark:bg-green-900/50 dark:border-green-400 dark:text-green-200">
                        <p className="text-lg sm:text-xl font-bold">บันทึกคำตอบเรียบร้อย</p>
                        <p className="text-sm sm:text-base">โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
                    </div>
                    <TaskNavigation showBackButton={false} />
                </div>
            )}
        </div>
    );
};

export default DrawingTask3;