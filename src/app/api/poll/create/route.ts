import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Poll from "@/models/PollModel";


connect();

export async function POST(request:NextRequest){
    try {
        const reqToken = await request.cookies.get('token');
        if(!reqToken){
            return NextResponse.json({message : "Unauthorized user"}, {status: 401})
        }

        const token : any = jwt.decode(reqToken.value);

        const reqBody = await request.json();

        reqBody.createdBy = token.id;

        const newPoll = new Poll(reqBody);

        const savedPoll = await newPoll.save();

        return NextResponse.json({ 
            message : "New Poll Created successfully" , 
            success : true,
            data : savedPoll
        }, {status: 200});
        

    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}