import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }
    try {
        const db= await mongoose.connect(process.env.MONGO_URI || "");
        console.log(db);
        connection.isConnected= db.connections[0].readyState;
        console.log("Db connected successfully");
    } catch (error) {
        console.log("Db connection failed: ",error);
        process.exit(1);
        
    }
}

export default dbConnect;