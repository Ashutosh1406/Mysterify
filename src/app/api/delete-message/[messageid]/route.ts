import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth";



export async function DELETE(request:Request , {params}:{params:{messageid:string}}){

    const messageId = params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions); //for currently logged in user
    const user:User = session?.user as User

    if(!session || !session.user){ //if not authenticated
        return Response.json(  
            {
                success:false,
                messsage:'Not Authenticated'
            },
            {status:401}
        )
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id}, //finding user
            {$pull : {messages:{_id:messageId}}}
        )
        if(updateResult.modifiedCount==0){
            return Response.json(  
                {
                    success:false,
                    messsage:'Message Not Found or Already Deleted!'
                },
                {status:404}
            )
        }

        return Response.json(  
            {
                success:true,
                messsage:'Message Deleted'
            },
            {status:200}
        )

    } catch (error) {
        console.log("This is message delete route error" , error)
        return Response.json(  
            {
                success:false,
                messsage:'Error Deleting Message'
            },
            {status:500}
        )
    }

}