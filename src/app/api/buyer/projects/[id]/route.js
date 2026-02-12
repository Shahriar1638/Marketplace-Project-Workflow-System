import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
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

    return NextResponse.json(project);
  } catch (error) {
    console.error("Fetch buyer project detail error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
