import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'assigned' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    
    return NextResponse.json({
      totalUsers,
      totalProjects,
      activeProjects,
      completedProjects
    });

  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
