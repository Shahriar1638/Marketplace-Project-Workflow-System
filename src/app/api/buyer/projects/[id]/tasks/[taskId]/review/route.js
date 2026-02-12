import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id, taskId } = await params;
    const { action, feedback } = await req.json();

    await dbConnect();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });
    if (project.buyerId.toString() !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized: You are not the buyer." }, { status: 403 });
    }

    const task = project.tasks.id(taskId);
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

    if (feedback) {
        task.feedback = feedback;
    }

    if (action === 'approve') {
        task.status = 'accepted';
    } else if (action === 'reject') {
        task.status = 'rejected';
    } else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await project.save();

    return NextResponse.json({ message: "Task status updated" }, { status: 200 });

  } catch (error) {
    console.error("Review task error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
