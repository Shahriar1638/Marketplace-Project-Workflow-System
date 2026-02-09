import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { title, note, zipUrl } = await req.json();

    await dbConnect();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    // Validate if current user is the assigned solver
    if (project.assignedSolverId.toString() !== session.user.id) {
        return NextResponse.json({ message: "You are not assigned to this project." }, { status: 403 });
    }

    // Add new task submission
    project.tasks.push({
        title,
        description: note, // Using description to store the note context if needed, or just keep note in submission
        status: 'submitted',
        submission: {
            zipUrl,
            submittedAt: new Date().toISOString().split('T')[0],
            note
        }
    });

    // Check if all estimated modules are done? Optional logic
    
    await project.save();

    return NextResponse.json({ message: "Task submitted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Submit task error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
