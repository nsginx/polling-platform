import { connect } from "@/dbConnect/dbConnect";
import Poll from "@/models/PollModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request:NextRequest){
    try {
        const url = request.nextUrl;
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const pollId = queryParams.id;

        const poll = await Poll.findById(pollId);

        if(!poll){
            return NextResponse.json({success : false, message : "No such poll found"}, {status: 400});
        }
        
        return NextResponse.json({success : true, data : poll}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}