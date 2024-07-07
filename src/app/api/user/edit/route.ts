import { connect } from "@/dbConnect/dbConnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

connect();

export async function PATCH(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {username} = reqBody;

        const reqToken = await request.cookies.get('token');

        if(!reqToken){
            return NextResponse.json({message : "Unauthorised user"}, {status : 401});
        }

        const reqTokenVal:any = jwt.decode(reqToken.value);

        const duplicateUser = await User.findOne({username});

        if(duplicateUser){
            return NextResponse.json({message : "username already exists"}, {status : 400});
        }

        const user = await User.findById(reqTokenVal.id);

        user.username = username;

        await user.save();

        return NextResponse.json({message : "username updated"}, {status : 200});

    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}

