import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, estimatedModules, description, deadline, phoneNumber } = await req.json();

    await dbConnect();

    // Check if user already applied
    const project = await Project.findById(projectId);
    if (!project) {
        return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const alreadyApplied = project.requests.some(r => r.solverId.toString() === session.user.id);
    if (alreadyApplied) {
        return NextResponse.json({ message: "You have already applied to this project." }, { status: 400 });
    }

    // Add new request
    project.requests.push({
        solverId: session.user.id,
        estimatedModules,
        description,
        deadline,
        phoneNumber,
        status: 'pending'
    });

    await project.save();

    return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Apply project error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
