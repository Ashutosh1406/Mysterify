import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User"


export async function POST(request:Request) {
    await dbConnect()

    const{username,content} = await request.json()

    try {
        
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(  
                {
                    success:false,
                    messsage:'User doesnt exits'
                },
                {status:404}
            )
        }
        if(!user.isAcceptingMessage){
            return Response.json(  
                {
                    success:false,
                    messsage:'User is not Accepting Messages'
                },
                {status:403}
            )
        }

        const newMessage = {content,createdAt:new Date()}

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(  
            {
                success:true,
                messsage:'Message sent successfully'
            },
            {status:200}
        )
    } catch (error) {
        console.log("Error Adding Messages",error)
        return Response.json(  
            {
                success:false,
                messsage:'Internal Server Error'
            },
            {status:500}
        )
    }
}