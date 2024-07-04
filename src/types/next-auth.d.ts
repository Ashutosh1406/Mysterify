//used in src/api/auth/..nextauth/"options.ts" line no 58
import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {  //module of next auth some interface change
    interface User{
        _id?:string,
        isVerified?:boolean,
        isAcceptingMessages?:boolean,
        username?:string
        
    }
    interface Session{
        user:{
            _id?: string,
            isVerified?:boolean,
            isAcceptingMessages?:boolean,
            username?:string
            
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string,
        isVerified?:boolean,
        isAcceptingMessages?:boolean,
        username?:string,
    }
}