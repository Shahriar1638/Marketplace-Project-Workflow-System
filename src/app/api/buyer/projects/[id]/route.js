import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    const project = await Project.findById(id)
        .populate({
            path: 'requests.solverId',
            select: 'name email profile.skills'
        })
        .populate('assignedSolverId', 'name');

    if (!project) {
        return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    if (project.buyerId.toString() !== session.user.id && session.user.role !== 'Admin') {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Fetch buyer project detail error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
