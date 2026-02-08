import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">FlowDesk</h1>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-2 border border-black hover:bg-black hover:text-white transition">
          Log In
        </Link>
        <Link href="/signup" className="px-6 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
