
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ? : number
}

const connection : ConnectionObject = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected To db")
        return
    }

    try {
    const db =  await mongoose.connect(process.env.MONGODB_URI || '', {})
    console.log(db)
    connection.isConnected = db.connections[0].readyState
    console.log(db.connections)    
    console.log("Database Connected SuccessFully");
    } catch (error) {
        console.log("Database Connectio Failed!",error);
        process.exit(1) //smoothly exit the app as db isn;t connected so application won't run
    }
}

export default dbConnect;