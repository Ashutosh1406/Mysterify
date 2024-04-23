import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username:usernameValidation,
})

export async function GET(request:Request) {

   // TODO: USE this in all other routes

    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success:true,
    //         message:'Method Not Allowed'
    //     },{status:405})
    // }
    await dbConnect()

    //eg https://localhost:3000/api/curr?username=ashutosh?phone=android?date130424
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParam)
        console.log("Jasjappan*****",result) //TODO: remove

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0
                        ?usernameErrors.join(',')
                        :'invalid query parameter'
            },{ status:400 })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:'Username is Already Taken',
            },{ status:400 })
        }
        return Response.json({
            success:true,
            message:'Username is Available'
        },{ status:400 })

    } catch (error) {
        console.error("Username checking failed",error)
        return Response.json({
            success:false,
            message:'Error Checking username'
        },{
            status:500
        })
    }
}