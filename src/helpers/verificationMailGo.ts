
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";


// export async function sendVerificationEmailwithService(email:string, username:string, verifyCode:string):Promise<ApiResponse> {
//     try {
//         const response = await axios.post('https://female-zabrina-ashutosh14-2f05ab0a.koyeb.app/send-verification-email', {
//             email,
//             username,
//             verifyCode
//         });

//         return{success:true, message:'Verification Email Sent Successfully'} 

//     } catch (error) {
//         console.error("Error Sending Verification Email", error);
//         return{ success:false, message:'Failed to send Verification Email'}
//     }
// }


export async function sendVerificationEmailwithService(
    email:string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>{
    try {
        const response = await axios.post('https://female-zabrina-ashutosh14-2f05ab0a.koyeb.app/send-verification-email', {
            email,
            username,
            verifyCode
        });

        return{success:true, message:'Verification Email Sent Successfully'}   
    } catch (emailError) {
        console.error("Error Sending Verification Email",emailError)
        return{ success:false, message:'Failed to send Verification Email'}
    }
}