import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth";
import mongoose from "mongoose";


export async function GET (request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions); //for currently logged in user
    const user: User = session?.user as User

    if(!session || !user){
        return Response.json(  
            {
                success:false,
                messsage:'Not Authenticated'
            },
            {status:401}
        )
    }
    
    const userId = new mongoose.Types.ObjectId(user._id); //mongoose object id

    if(!userId){
        return Response.json(  
            {
                success:false,
                messsage:'No User Found'
            },
            {status:406}
        )
    }
    console.log("This is user id",user._id);

    try{
        const user = await UserModel.aggregate([
            {$match : {_id: userId}},
            {$unwind : '$messages'},
            {$sort: {'messages.createdAt': -1}}, //ascending order
            {$group: {_id: '$_id', messages:{$push: '$messages'}}}
        ]).exec()

        console.log("this is user after agg",user)
        if(!user || user.length === 0){
            return Response.json(  
                {
                    success:true,
                    messsage:'No message found'
                },
                {status:201}
            )
        }
        
        const userMessages = user[0].messages || [];

        if(userMessages.length === 0){
            return Response.json({
                success: false,
                message: 'No message Found in inbox',
            },{
                status: 204 
            }
            );
        }
        return Response.json(  
            {
                success:true,
                messages: user[0].messages
            },
            {status:200}
        )
    
    } catch(error){
        return Response.json(  
                    {
                        success:false,
                        messsage:'No Message From Server check'
                    },
                    {status:500}
                )
    }
}