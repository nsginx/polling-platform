import { connect } from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request:NextRequest){
    try {

        const response = NextResponse.json({
            message : "User Logged out successfully",
            success : true
        }, {status : 200})

        response.cookies.set('token', '', {
            httpOnly : true,
            expires: Date.now()
        })

        return response;
        
    } catch (error: any) {
        return NextResponse.json({error : error.message}, {status: 500});
    }
}