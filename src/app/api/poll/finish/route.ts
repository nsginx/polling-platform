import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Poll from "@/models/PollModel";
import jwt from 'jsonwebtoken';

connect();

export async function PATCH(request:NextRequest){
    try {

        const reqToken = await request.cookies.get('token');

        if(!reqToken){
            return NextResponse.json({message : "Unauthorized user"}, {status: 401})
        }

        const token : any = jwt.decode(reqToken.value);

        const url = request.nextUrl;
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const pollId = queryParams.id;

        const poll = await Poll.findOne({_id : pollId});
        console.log(poll);
        

        if(poll.createdBy != token.id){
            return NextResponse.json({message : "You can only finish a poll created by yourself"}, {status: 401})
        }
        
        poll.expiry = Date.now();

        await poll.save();

        return NextResponse.json({
            message : "Poll finished",
            success : true, 
            data : poll
        }, {status: 200});


    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}