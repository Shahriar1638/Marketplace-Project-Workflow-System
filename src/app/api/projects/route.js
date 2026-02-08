import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, budget, deadline, techStack } = await req.json();

    await dbConnect();

    const newProject = await Project.create({
        title,
        description,
        techStack: techStack ? techStack.split(',').map(s => s.trim()).filter(s => s) : [],
        budget,
        buyerId: session.user.id, // Assign to logged-in user
        // Deadline passed in body can be stored if you added it to schema, 
        // or just rely on title/desc/budget for now as per minimal schema.
    });

    return NextResponse.json({ message: "Project created", projectId: newProject._id }, { status: 201 });

  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
