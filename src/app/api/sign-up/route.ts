import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import {sendVerificationEmailwithService} from "@/helpers/verificationMailGo"

export async function POST(request:Request){
    await dbConnect()

    try{ //algorithm strats for basic signup    
        const {username,email,password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({username,isVerified:true,})

        if(existingUserVerifiedByUsername) { //if exists
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400}
            );
        }

        const existingUserByEmail = await UserModel.findOne({email})

        let verifyCode = Math.floor(100000 + Math.random()*90000).toString()

        if(existingUserByEmail){ 
            // if we find user based on email we will return and respond
            // with email already Taken
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User Already Exist with this email"
                },{status:400}
                )
            }else{  //exist but not verified
                const encryptPassword = await bcrypt.hash(password,12)
                existingUserByEmail.username = username
                existingUserByEmail.password = encryptPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }

        }else{
            const encryptPassword = await bcrypt.hash(password,11)
            const expiryDate = new Date() 
            expiryDate.setHours(expiryDate.getHours()+1)
            
            //Save To DB 
            const newUser =  new UserModel({
                username,
                email,
                password:encryptPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[],
            })

            await newUser.save()
        }

        //send verificationEmail by using fn in helpers/sendVerification Email
        const emailOTP = await sendVerificationEmailwithService(
            email,
            username,
            verifyCode
        )

        if(!emailOTP.success){ //if not success
            return Response.json({
                success:false,
                message:emailOTP.message
            },{status:500}
            )
        }

        return Response.json(
            {
                success:true,
                message:"User Registered Successfully , Please verify your email"
            },
            {status:201}
        )
    }catch(error){
        console.error('Error Registering User',error)
        return Response.json({
            success: false,
            message:"Error registering User" //sent to frontEND
        },{
            status:500
        }
    )
    }
}