import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    // Fetch only open/unassigned projects, sorted by newest first
    const projects = await Project.find({ status: 'open' })
                                  .populate('buyerId', 'name') // Optional: show buyer name
                                  .sort({ createdAt: -1 });

    return NextResponse.json(projects);

  } catch (error) {
    console.error("Fetch open projects error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
