import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // Fetch projects where the requests array contains an entry with the current user's ID
    const projects = await Project.find({
        "requests.solverId": session.user.id
    })
    .populate('buyerId', 'name')
    .sort({ createdAt: -1 });

    return NextResponse.json(projects);

  } catch (error) {
    console.error("Fetch requested projects error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
