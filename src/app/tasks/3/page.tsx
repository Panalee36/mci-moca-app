"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTest } from '../../context/TestContext';
import { TaskNavigation } from '../../components/TaskNavigation';
import Image from 'next/image';
import square2dImage from '../../img/drawing/square.jpg';

interface Point {
    id: number;
    x: number;
    y: number;
}

const GRID_SIZE = 10;

// Generate points for the grid
const generateGridPoints = (): Point[] => {
    const points: Point[] = [];
    let id = 0;
    const step = 100 / (GRID_SIZE + 1);
    for (let i = 1; i <= GRID_SIZE; i++) {
        for (let j = 1; j <= GRID_SIZE; j++) {
            points.push({ id: id++, x: j * step, y: i * step });
        }
    }
    return points;
};

const GRID_POINTS = generateGridPoints();

const DrawingTask3 = () => {
    const { updateScore } = useTest();
    const [phase, setPhase] = useState<'viewing' | 'drawing' | 'finished'>('viewing');
    const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
    const [connections, setConnections] = useState<Array<{ from: number, to: number }>>([]);

    useEffect(() => {
        if (phase === 'viewing') {
            const timer = setTimeout(() => setPhase('drawing'), 15000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    const handlePointClick = (pointId: number) => {
        if (phase !== 'drawing') return;

        if (selectedPoint === null) {
            setSelectedPoint(pointId);
        } else if (selectedPoint === pointId) {
            setSelectedPoint(null);
        } else {
            const newConnection = { from: selectedPoint, to: pointId };
            // Avoid duplicate connections
            const isDuplicate = connections.some(
                conn => (conn.from === newConnection.from && conn.to === newConnection.to) || (conn.from === newConnection.to && conn.to === newConnection.from)
            );
            if (!isDuplicate) {
                setConnections(prev => [...prev, newConnection]);
            }
            setSelectedPoint(null);
        }
    };

    const getPointStatus = (pointId: number) => {
        if (selectedPoint === pointId) return 'selected';
        const isConnected = connections.some(conn => conn.from === pointId || conn.to === pointId);
        if (isConnected) return 'connected';
        return 'default';
    };

    const getPointClasses = (pointId: number) => {
        const status = getPointStatus(pointId);
        const baseClasses = 'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-125';

        switch (status) {
            case 'selected':
                return `${baseClasses} bg-yellow-400 border-yellow-600 ring-2 ring-yellow-300 dark:bg-yellow-500 dark:border-yellow-700 dark:ring-yellow-400`;
            case 'connected':
                return `${baseClasses} bg-blue-500 border-blue-600 dark:bg-blue-600 dark:border-blue-700`;
            default:
                return `${baseClasses} bg-gray-200 border-gray-400 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:hover:bg-gray-600`;
        }
    };

    const resetDrawing = () => {
        setConnections([]);
        setSelectedPoint(null);
    };

    const submitDrawing = () => {
        // Scoring is based on whether the user drew anything
        const newScore = connections.length > 0 ? 1 : 0;
        updateScore(3, newScore);
        setPhase('finished');
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-blue-800 dark:text-blue-300 mb-4">แบบทดสอบที่ 3: การวาดรูป</h2>

            {phase === 'viewing' && (
                <div className="text-center">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6"><strong>คำสั่ง:</strong> โปรดจดจำภาพลูกบาศก์นี้ คุณมีเวลา 15 วินาที</p>
                    <div className="flex justify-center mb-4">
                        <Image
                            src={square2dImage}
                            alt="2D Cube Example"
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
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6"><strong>คำสั่ง:</strong> โปรดวาดรูปตามที่เห็นก่อนหน้านี้ โดยการเชื่อมจุด</p>

                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="relative w-full max-w-md h-80 sm:h-96 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
                            {GRID_POINTS.map((point) => (
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
                                />
                            ))}

                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                {connections.map((conn, index) => {
                                    const fromPoint = GRID_POINTS.find(p => p.id === conn.from);
                                    const toPoint = GRID_POINTS.find(p => p.id === conn.to);
                                    if (!fromPoint || !toPoint) return null;

                                    return (
                                        <line
                                            key={index}
                                            x1={`${fromPoint.x}%`}
                                            y1={`${fromPoint.y}%`}
                                            x2={`${toPoint.x}%`}
                                            y2={`${toPoint.y}%`}
                                            className="stroke-blue-500 dark:stroke-blue-400"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
                        <button
                            onClick={resetDrawing}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base w-full sm:w-auto dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
                        >
                            ล้างทั้งหมด
                        </button>
                        <button
                            onClick={submitDrawing}
                            disabled={connections.length === 0}
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
                    <TaskNavigation />
                </div>
            )}
        </div>
    );
};

export default DrawingTask3;