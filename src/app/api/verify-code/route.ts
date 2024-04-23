import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername}) //db call to match 

        if(!user){
            return Response.json({
                success:false,
                messsage:'User not found'
            },{status:500})
        }

        const isCodeValid = (user.verifyCode===code)
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save()
            return Response.json({
                success:true,
                messsage:'Account Verified Successfully'
            },{status:200})
        }
        else if(!isCodeNotExpired){
            return Response.json(  // TODO: verification code expired generate new
            {
                success:false,
                messsage:'Verification Code has expired'
            },
            {status:400}
            )
        }else{ 
            return Response.json(  
            {
                success:false,
                messsage:'Verification Code is Incorrect'
            },
            {status:400}
            )
        }

    } catch (error) {
        console.error("Error in Verification Process",error)
        return Response.json({
            success:false,
            message:'Error Checking username'
        },{
            status:500
        })
    }
}