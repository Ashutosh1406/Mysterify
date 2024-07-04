import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {generateResetToken} from '@/lib/reset'


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
        //const resetToken = generateResetToken()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            //user.resetToken = resetToken
            //user.resetPasswordExpiry = new Date(Date.now() + 600000)
            await user.save()
            
            return Response.json({
                success:true,
                messsage:'Account Verified Successfully',
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


// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';
// import {generateResetToken} from '@/lib/reset'

// export async function POST(request: Request) {
//   // Connect to the database
//   await dbConnect();

//   try {
//     const { username, code } = await request.json();
//     const decodedUsername = decodeURIComponent(username);
//     const user = await UserModel.findOne({ username: decodedUsername });

//     if (!user) {
//       return Response.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Check if the code is correct and not expired
//     const isCodeValid = user.verifyCode === code;
//     const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

//     if (isCodeValid && isCodeNotExpired) {
//       // Update the user's verification status
//       user.isVerified = true;
//       await user.save();

//       return Response.json(
//         { success: true, message: 'Account verified successfully' },
//         { status: 200 }
//       );
//     } else if (!isCodeNotExpired) {
//       // Code has expired
//       return Response.json(
//         {
//           success: false,
//           message:
//             'Verification code has expired. Please sign up again to get a new code.',
//         },
//         { status: 400 }
//       );
//     } else {
//       // Code is incorrect
//       return Response.json(
//         { success: false, message: 'Incorrect verification code' },
//         { status: 400 }
//       );
//     }

    
//   } catch (error) {
//     console.error('Error verifying user:', error);
//     return Response.json(
//       { success: false, message: 'Error verifying user' },
//       { status: 500 }
//     );
//   }
// }



