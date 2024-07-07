import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Poll from "@/models/PollModel";
import jwt from 'jsonwebtoken';

connect();

export async function GET(request:NextRequest){
    try {

        const reqToken = await request.cookies.get('token');

        if(!reqToken){
            return NextResponse.json({message : "Unauthorized user"}, {status: 401})
        }

        const token : any = jwt.decode(reqToken.value);

        const polls = await Poll.find({createdBy : token.id});

        return NextResponse.json({
            success : true, 
            data : polls
        }, {status: 200});


    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}