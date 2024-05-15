import mongoose , {Schema,Document} from "mongoose";

export interface Message extends Document{  //interface for db using Ts and extending it through Mongoose Document
    content : string;
    createdAt : Date;
}


const MessageSchema:Schema<Message> = new Schema({
    content:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        required:true,
        default:Date.now
    }
})


export interface User extends Document{  //for User
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema:Schema<User> = new Schema({
    username:{
        type: String,
        required:[true,"Username is Required"],
        trim:true,
        unique:true
    },
    email:{
        type: String,
        required:[true,"Email is Required"],
        unique:true,
        match: [/.+\@.+\..+/,"Please use a valid email address"]  //regex,message (regex-r)
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    verifyCode:{
        type:String,
        required:[true,"VerifyCode is Required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"VerifyCode Expiry is Must"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema]
},{
    collection:'users',
    versionKey:false,
});

/* export statements in TypeScript */

//(1) || (2) where first "(1)" means that model already exist and its return type is just Like User Schema
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel;
