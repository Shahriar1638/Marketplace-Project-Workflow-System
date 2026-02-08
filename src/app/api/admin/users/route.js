import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // TODO: Add Admin Auth Check here (skipped for speed as requested, but crucial for prod)
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
    }
}
