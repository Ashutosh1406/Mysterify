import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import brcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions = {

    providers:[
        CredentialsProvider({   //NextAuth documentation
            id:"credentials",
            name:"credentials",
            credentials: {
                username: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},        // ES6
                            {username: credentials.identifier.username} 
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with these credentials')
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify your Account')
                    }
                    //password check stores boolean(as bcrypt .compare return boolean)
                    const isPasswordCorrect = await brcrypt.compare(credentials.password,user.password)

                    if(isPasswordCorrect){
                        return user
                    }else {
                        throw new Error('Password Incorrect')
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
       // TODO:
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // },{})
    ],
    callbacks:{
        async session({ session,token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
        async jwt({ token, user,}) { //next-auth.d.ts for modification of user
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages,
                token.username = user.username
            }

            return token
        },
    },
    pages:{
        signIn:'/signIn', // "Next" can handle automatically
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}
