import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Poll from "@/models/PollModel";

connect();

export async function DELETE(request:NextRequest){
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
        

        if(poll.createdBy != token.id){
            return NextResponse.json({message : "You can only delete poll created by yourself"}, {status: 401})
        }

        await Poll.deleteOne({_id : pollId});


        return NextResponse.json({
            message : "Poll deleted successfully",
            success : true
        }, {status: 200})

        
    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}