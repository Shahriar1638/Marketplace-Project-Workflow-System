"use client";
import UserDashboard from "@/components/UserDashboard";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session) {
        // Redirect based on role
        if (session.user.role === 'Buyer') router.push('/buyer');
        else if (session.user.role === 'Problem Solver') router.push('/solver');
        else if (session.user.role === 'Admin') router.push('/admin');
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  // If user is just a regular "User", show the dashboard to upgrade
  if (session.user.role === 'User') {
    return (
        <div className="min-h-screen p-4 flex flex-col items-center">
             <div className="w-full max-w-4xl flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">FlowDesk</h1>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-1 text-sm bg-black text-white border border-black hover:bg-white hover:text-black transition"
                >
                    Sign Out
                </button>
            </div>
            <UserDashboard />
        </div>
    );
  }

  // Default view for other roles (will update later)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-4xl font-bold text-center">
        Hello world, {session.user.role}
      </h1>
      
      <p className="text-lg">Logged in as: {session.user.role}</p>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-6 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition font-bold"
      >
        Sign Out
      </button>
    </div>
  );
}
