import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { title, description, deadline } = await req.json();

    await dbConnect();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    if (project.assignedSolverId.toString() !== session.user.id) {
        return NextResponse.json({ message: "You are not assigned to this project." }, { status: 403 });
    }

    // Add new task (milestone)
    project.tasks.push({
        title,
        description,
        deadline,
        status: 'pending',
        submission: {} // Empty submission initially
    });

    await project.save();

    return NextResponse.json({ message: "Milestone created successfully" }, { status: 200 });

  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
