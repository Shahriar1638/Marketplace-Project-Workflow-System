import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        await dbConnect();
        const { userId, role, action } = await req.json();

        if (action === 'approve') {
            await User.findByIdAndUpdate(userId, {
                role: role,
                "requestStatus.status": "approved",
                "requestStatus.role": null
            });
             await User.findByIdAndUpdate(userId, {
                 $unset: { requestStatus: 1 } 
             });
        } else if (action === 'reject') {
            await User.findByIdAndUpdate(userId, {
                "requestStatus.status": "rejected"
            });
        }

        return NextResponse.json({ message: "User updated" });
    } catch (error) {
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
}
