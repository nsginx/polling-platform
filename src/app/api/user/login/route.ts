import User from "@/models/UserModel";
import bcryptjs from 'bcryptjs';
import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

connect();

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({ message : "User Not Found !"}, {status: 400});
        }
        
        const isValidPassword = await bcryptjs.compare(password, user.password);
        
        if(!isValidPassword){
            return NextResponse.json({ message : "Wrong Credential"}, {status: 400});
        }

        const tokenData = {
            id : user._id,
            username : user.username,
            email : user.email,
            isVerified : user.isVerified
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn : '1d'})

        const response = NextResponse.json({
            message : "User logged in successfully",
            success : true,
        }, {status : 200})

        response.cookies.set("token", token, {
            httpOnly : true
        });

        return response;
        
    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}