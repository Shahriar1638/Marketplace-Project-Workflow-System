import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const projects = await Project.find({ buyerId: session.user.id })
                                    .populate('assignedSolverId', 'name')
                                    .sort({ createdAt: -1 });

    return NextResponse.json(projects);

  } catch (error) {
    console.error("Fetch buyer projects error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
