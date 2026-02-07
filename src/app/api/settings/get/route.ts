import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";

export async function POST(req:NextRequest){
    try {
        const {ownerId}=await req.json()
        if(!ownerId){
            return NextResponse.json({error:"OwnerId is required"},{status:400})
        }
        await connectDb()
        const setting=await Settings.findOne(
            {ownerId}
        )
        return NextResponse.json(setting)
    } catch (error) {
        return NextResponse.json({error:"Failed to get settings"},{status:500})
    }
}