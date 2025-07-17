"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
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
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
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

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (phase === 'drawing') {
            dots.forEach((dot, index) => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = '#999'; 
                ctx.fill();

                if (activeDotIndex === index) {
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, ACTIVE_DOT_RADIUS, 0, Math.PI * 2);
                    ctx.fillStyle = 'blue';
                    ctx.fill();
                }
            });

            drawnLines.forEach(line => {
                const fromDot = dots[line.from];
                const toDot = dots[line.to];
                if (fromDot && toDot) {
                    drawLine(fromDot.x, fromDot.y, toDot.x, toDot.y);
                }
            });
        }
    }, [phase, dots, drawnLines, activeDotIndex, drawLine]); 

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.button !== 0 || phase !== 'drawing') return; 
        const canvas = canvasRef.current;
        if (!canvas) return;

        const pos = getMousePos(canvas, e);
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
    }, [getMousePos, getNearestDotIndex, activeDotIndex, drawnLines, phase]);

    const clearCanvas = useCallback(() => {
        setDrawnLines([]); 
        setActiveDotIndex(null); 
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas!.width, canvas!.height); 
        }
    }, []);

    // *** ปรับปรุงการให้คะแนน: วาด 1 เส้นก็ได้ 1 คะแนนเต็ม ***
    const submitDrawing = useCallback(() => {
        // ตรวจสอบว่ามีเส้นวาดอย่างน้อย 1 เส้นหรือไม่
        const newScore = drawnLines.length > 0 ? 1 : 0; // ถ้ามีเส้นวาด จะได้ 1 คะแนน มิฉะนั้นจะได้ 0

        updateScore(3, newScore); 
        setPhase('finished');
    }, [drawnLines, updateScore]); // drawnLines เป็น dependency เพื่อให้โค้ดทำงานถูกต้อง

    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">แบบทดสอบที่ 3: การวาดภาพ</h2>

            {phase === 'viewing' && (
                <div className="text-center">
                    <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> โปรดจดจำภาพสี่เหลี่ยมนี้ คุณมีเวลา 15 วินาที</p>
                    <div className="flex justify-center">
                        <Image src={square2dImage} alt="2D Square Example" width={400} height={400} className="rounded-lg shadow-md" />
                    </div>
                    <p className="mt-4 text-sm text-gray-500">หน้าจอจะเปลี่ยนโดยอัตโนมัติเมื่อหมดเวลา...</p>
                </div>
            )}

            {phase === 'drawing' && (
                <div className="text-center">
                    <p className="text-lg text-gray-700 mb-6"><strong>คำสั่ง:</strong> เริ่มจาดจุดไหนก่อนก็ได้โดยการเชื่อมจุด</p>
                    <div className="flex justify-center mb-4">
                        <canvas
                            ref={canvasRef}
                            width={GRID_SIZE * DOT_SPACING + 2 * CANVAS_OFFSET}
                            height={GRID_SIZE * DOT_SPACING + 2 * CANVAS_OFFSET}
                            className="border-4 border-blue-400 rounded-lg bg-white cursor-crosshair shadow-lg"
                            onMouseDown={handleMouseDown}
                        />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={clearCanvas} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">ล้างทั้งหมด</button>
                        <button onClick={submitDrawing} disabled={drawnLines.length === 0} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">ส่งคำตอบ</button>
                    </div>
                </div>
            )}

            {phase === 'finished' && (
                <div className="text-center flex flex-col items-center gap-6">
                    <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg w-full max-w-md">
                        <p className="text-xl font-bold">บันทึกคำตอบเรียบร้อย</p>
                        <p>โปรดกดปุ่ม &quot;ถัดไป&quot; เพื่อทำแบบทดสอบข้อต่อไป</p>
                    </div>
                    <TaskNavigation showBackButton={false} />
                </div>
            )}
        </div>
    );
};

export default DrawingTask3;