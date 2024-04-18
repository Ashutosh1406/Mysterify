import {z} from 'zod'

export const usernameValidation = z
                                .string()
                                .min(2,"Username should be atleast 2 characters")
                                .max(20,"Username must be no more than 20 characters")
                                .regex(/^[A-Za-z0-9.-]+$/) //only numbers,uppercase,lowercase alphabets along with hiphen or "." allowed 



export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:'Invalid Email Address'}),
    password:z.string().min(6,{message:'Password must be atleast 6 characters for better safety'})
})