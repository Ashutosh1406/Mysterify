import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth";


// POST request for changing status of user either accepting or not
export async function POST(request:Request) {
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

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {isAcceptingMessage:acceptMessages},
                {new:true}
            )
            if(!updatedUser){
                return Response.json(  
                    {
                        success:false,
                        messsage:'Failed to Update user status to accept messages'
                    },
                    {status:401}
                )
            }

            return Response.json(  
                {
                    success:true,
                    messsage:'Message Status Updated Successfully',
                    updatedUser
                },
                {status:200}
            )


    } catch (error) {
        console.log("Failed to Update user status to accept Messages")
        return Response.json(  
            {
                success:false,
                messsage:'Failed to Update user status to accept messages'
            },
            {status:500}
        )
    }

}

// GET request to check status of current User
export async function GET(request:Request){
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

    const userId = user._id

    try {

        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json(  
                {
                    success:false,
                    messsage:'User Not Found'
                },
                {status:404}
            )
        }
    
        return Response.json(  
            {
                success:true,
                messsage:'Not Authenticated',
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {status:200}
        )
    } catch (error) {
        console.log("Failed to Update user status to accept Messages")
        return Response.json(  
            {
                success:false,
                messsage:'Error in getting message acceptance status from '
            },
            {status:500}
        )
    }

}