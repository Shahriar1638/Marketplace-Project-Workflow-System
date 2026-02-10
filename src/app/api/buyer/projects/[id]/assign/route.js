import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route"; // careful with relative path
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { solverId, estimatedModules, estimatedDeadline } = await req.json();

    await dbConnect();
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    // Update Project Status
    project.status = 'assigned';
    project.assignedSolverId = solverId;
    
    // Store assignment details
    project.assignmentDetails = {
        estimatedModules,
        estimatedDeadlineForEntireProject: estimatedDeadline
    };

    // Update Request Status
    const requestIndex = project.requests.findIndex(r => r.solverId.toString() === solverId);
    if (requestIndex > -1) {
        project.requests[requestIndex].status = 'accepted';
    }

    // Initialize Tasks Array (Optional: We leave it empty as per request, to be filled by solver later)
    // project.tasks = []; 

    await project.save();

    return NextResponse.json({ message: "Project assigned successfully" }, { status: 200 });

  } catch (error) {
    console.error("Assign project error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
