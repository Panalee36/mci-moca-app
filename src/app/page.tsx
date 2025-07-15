import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
                <h1 className="text-4xl font-bold">แบบประเมิน MoCA</h1>
                <p className="mt-4 text-lg">ยินดีต้อนรับสู่แบบทดสอบสภาพสมองเบื้องต้น</p>
        <Link href="/tasks/1">
          <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            เริ่มทำแบบทดสอบ
          </button>
        </Link>
      </div>
    </main>
  );
}
