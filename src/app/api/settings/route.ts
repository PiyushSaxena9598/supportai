import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {ownerId,businessName,supportEmail,knowledge}=await req.json()
        if(!ownerId){
            return NextResponse.json({error:"OwnerId is required"},{status:400})
        }
        await connectDb()
        const settings=await Settings.findOneAndUpdate(
            {ownerId},
            {ownerId,businessName,supportEmail,knowledge},
            {new:true, upsert:true}
        )
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({error:"Failed to update settings"},{status:500})
    }
}

