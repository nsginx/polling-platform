import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Poll from "@/models/PollModel";

connect();

export async function PATCH(request:NextRequest){
    try {
        const reqToken = await request.cookies.get('token');

        if(!reqToken){
            return NextResponse.json({message : "No user"}, {status: 401})
        }

        const token : any = jwt.decode(reqToken.value);

        const url = request.nextUrl;
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const pollId = queryParams.id;

        const poll = await Poll.findById(pollId);

        if(poll.createdBy != token.id){
            return NextResponse.json({message : "Permission denied"}, {status: 401})
        }

        const reqBody = await request.json();

        const {isAnonymous} = reqBody;

        poll.isAnonymous = isAnonymous;

        await poll.save();
        
        return NextResponse.json({
            message : "Updated visibility",
            success : true,
            data : poll
        }, {status: 200})


    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}