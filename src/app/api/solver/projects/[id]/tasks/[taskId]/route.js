import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id, taskId } = await params;

    await dbConnect();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    // Validate ownership
    if (project.assignedSolverId.toString() !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const task = project.tasks.id(taskId);
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

    // Only allow deletion if pending or rejected? Or maybe just not 'accepted'?
    if (task.status === 'accepted') {
        return NextResponse.json({ message: "Cannot delete an accepted task." }, { status: 400 });
    }

    // Remove the task
    project.tasks.pull(taskId);
    await project.save();

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id, taskId } = await params;
    const { title, description, deadline } = await req.json();

    await dbConnect();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    if (project.assignedSolverId.toString() !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const task = project.tasks.id(taskId);
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

    if (task.status === 'accepted') {
        return NextResponse.json({ message: "Cannot edit an accepted task." }, { status: 400 });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (deadline) task.deadline = deadline;

    await project.save();

    return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
