import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { projectId, requestId, description, estimatedModules, deadline } = await req.json();

    await dbConnect();
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    // Find the request subdocument
    const request = project.requests.id(requestId);
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    // Verify ownership
    if (request.solverId.toString() !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Check if project is already assigned to someone else
    if (project.assignedSolverId && project.assignedSolverId.toString() !== session.user.id) {
         return NextResponse.json({ message: "Project already assigned to another solver. Cannot edit." }, { status: 403 });
    }

    // Check if THIS request is already accepted (if you are the assigned one, maybe you shouldn't edit the proposal anymore?)
    // But user asked: "however if some else got assigned to the project dont show edit option"
    // So if *I* am assigned, technically I can edit? Or usually once accepted, terms are locked.
    // Let's assume consistent with "assigned to SOME ELSE". If assigned to ME, terms are locked in `assignmentDetails`.
    // So if the project status is 'assigned', edits should probably be disabled regardless to avoid discrepancies.
    if (project.status === 'assigned') {
        return NextResponse.json({ message: "Project is already assigned. Cannot edit proposal." }, { status: 400 });
    }

    // Update fields
    if (description) request.description = description;
    if (estimatedModules) request.estimatedModules = estimatedModules;
    if (deadline) request.deadline = deadline;

    await project.save();

    return NextResponse.json({ message: "Application updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
