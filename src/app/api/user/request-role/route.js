import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { requestedRole, profileData } = await req.json();

    if (!['Buyer', 'Problem Solver'].includes(requestedRole)) {
        return NextResponse.json({ message: "Invalid role requested" }, { status: 400 });
    }

    await dbConnect();

    const updateData = {
      requestStatus: {
        requestedRole,
        status: 'pending',
        submittedAt: new Date().toISOString().split('T')[0],
      }
    };

    // If requesting Problem Solver, update profile fields too
    if (requestedRole === 'Problem Solver' && profileData) {
        updateData.profile = {
            bio: profileData.bio,
            skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : [],
            phone: profileData.phone,
            github: profileData.github,
        };
    }

    await User.findByIdAndUpdate(session.user.id, updateData);

    return NextResponse.json({ message: "Request submitted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Role request error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
