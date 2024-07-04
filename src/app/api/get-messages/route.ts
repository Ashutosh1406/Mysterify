import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth";
import mongoose from "mongoose";


export async function GET (request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions); //for currently logged in user
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json(  
            {
                success:false,
                messsage:'Not Authenticated'
            },
            {status:401}
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id); //mongoose object id
    console.log(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                // MATCH

                $match:{ id:userId },

            },
            {
                //Unwinding message array

                $unwind: '$messages',

            },
            {
                //SORTING
                $sort:{'messages.createdAt':-1}
            },
            {
                //GROUPING

                $group:{_id:'$_id',messages:{$push:'messages'}}
            }
        ])

        if(!user || user.length===0){
            return Response.json(  
                {
                    success:false,
                    messsage:'User Not Found'
                },
                {status:401}
            )
        }

        return Response.json(  
            {
                success:true,
                messsages:user[0].messages
            },
            {status:200}
        )
    } catch (error) {
        console.log("An UNexpected error Occured",error)
        return Response.json(  
            {
                success:false,
                messsage:'No Message From Server check'
            },
            {status:500}
        )
    }



}