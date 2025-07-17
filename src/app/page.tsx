import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-24">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">แบบประเมิน MoCA</h1>
        <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 px-4">ยินดีต้อนรับสู่แบบทดสอบสภาพสมองเบื้องต้น</p>
        <Link href="/tasks/1">
          <button className="mt-6 sm:mt-8 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-sm sm:text-base w-full sm:w-auto">
            เริ่มทำแบบทดสอบ
          </button>
        </Link>
      </div>
    </main>
  );
}
