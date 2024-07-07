import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Poll from "@/models/PollModel";

connect();

export async function PUT(request:NextRequest){
    try {

        const reqToken = await request.cookies.get('token');

        if(!reqToken){
            return NextResponse.json({message : "Unauthorized user"}, {status: 401})
        }

        const token : any = jwt.decode(reqToken.value);
        
        const url = request.nextUrl;
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const pollId = queryParams.id;

        const reqBody = await request.json();

        const {votes} = reqBody;

        const poll = await Poll.findOne({_id : pollId, expiry : {$gt: Date.now()}});

        if(!poll){
            return NextResponse.json({message : "Poll not found"}, {status: 400});
        }

        
        // const optionIds= ["6685437a8a0382e3c3e5ab95"]
        
        await Promise.all(votes.map(async (option:any) => {
            const { id, userVote } = option;

            if (userVote) {
                await Poll.updateOne(
                    { _id: pollId, 'options._id': id },
                    { $addToSet: { 'options.$.voted': token.id } } 
                );
            } else {
                await Poll.updateOne(
                    { _id: pollId, 'options._id': id },
                    { $pull: { 'options.$.voted': token.id } }
                );
            }
        }));

        const updatedPoll = await Poll.findOne({_id : pollId});

        return NextResponse.json({data : updatedPoll}, {status: 200});        
        
    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}