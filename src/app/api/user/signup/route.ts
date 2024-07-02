import { connect } from "@/dbConnect/dbConnect";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
    
        const {username, email, password} = reqBody;
    
        const user = await User.findOne({email});
    
        if(user){
            return NextResponse.json({ message : "User already exists"}, {status : 400})
        }
    
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password : hashedPassword

        })

        const savedUser = await newUser.save();
        // console.log(savedUser);

        const addedUser = await User.findOne({email});

        const tokenData = {
            id : addedUser._id,
            username : addedUser.username,
            email : addedUser.email,
            isVerified : addedUser.isVerified
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn : '1d'})

        const response = NextResponse.json({
            success : true,
            message : "New User saved successfully",
        }, { status : 200 })
        

        response.cookies.set("token", token, {
            httpOnly : true
        });

        return response;
        
    } catch (error : any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }



}