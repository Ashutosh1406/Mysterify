import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(request:Request){
    await dbConnect()
    
    try {
        const {password1,username}= await request.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }
        
        const encryptPassword = await bcrypt.hash(password1,12)
        user.password = encryptPassword;
        await user.save()

        return Response.json({
            success: true,
            message:"Password Reset Successfull" //sent to frontEND
        },{
            status:200
        }
        );
        
    } catch (error) {
        console.error('Password Reset Server Error',error)
        return Response.json({
            success: false,
            message:"Password Reset Server Error" //sent to frontEND
        },{
            status:500
        }
        );
    }
}