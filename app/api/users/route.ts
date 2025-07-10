import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const body = await req.json()
        const user = await User.create(body)
        return NextResponse.json({ status: "success", user });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
    }
}