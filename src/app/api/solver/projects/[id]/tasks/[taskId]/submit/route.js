import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id, taskId } = await params;
    const { note, zipUrl } = await req.json();

    await dbConnect();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    if (project.assignedSolverId.toString() !== session.user.id) {
        return NextResponse.json({ message: "You are not assigned to this project." }, { status: 403 });
    }

    const task = project.tasks.id(taskId);
    if (!task) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    task.status = 'submitted';
    task.submission = {
        zipUrl,
        submittedAt: new Date().toISOString().split('T')[0],
        note
    };

    await project.save();

    return NextResponse.json({ message: "Task submitted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Submit task error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
