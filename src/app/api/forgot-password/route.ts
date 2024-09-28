import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import {sendVerificationEmailwithService} from "@/helpers/verificationMailGo"

import { NextResponse } from "next/server";
export async function POST(request:Request){
    await dbConnect()

    try{ //algorithm strats for basic signup    
        
        const {credential} = await request.json()
        const existingUser = await UserModel.findOne(
            {
                $or:[{username:credential} , {email:credential}],
                isVerified:true,
            }
        );
        console.log(existingUser);
        if(existingUser) { //if exists

            let verifyCode = Math.floor(100000 + Math.random()*90000).toString()
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)


            existingUser.verifyCode = verifyCode;
            existingUser.verifyCodeExpiry = expiryDate

            await existingUser.save();

            const emailOTP = await sendVerificationEmailwithService(
                existingUser.email,
                existingUser.username,
                existingUser.verifyCode
            )
    
            if(!emailOTP.success){ //if not success
                return Response.json({
                    success:false,
                    message:emailOTP.message
                },{status:500}
                )
            }
            const username = existingUser.username
            return Response.json(
                {
                    success:true,
                    message:"User Registered Successfully , Please verify your email",
                    username:username
                },
                {status:201}
            )
        }else{
            return NextResponse.json({message:'User doesnt exist'},{status:500})
        }
        
        //router.replace(`/verify/${username}`);
    }catch(error){
        console.error('Error Reseting Password',error)
        return Response.json({
            success: false,
            message:"Error registering User" //sent to frontEND
        },{
            status:500
        }
        )
    }
}

//steps 

