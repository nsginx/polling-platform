import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
    
        const connection = mongoose.connection;
    
        connection.on('connected', ()=>{
            console.log("db connected successfully");
        })
    
        connection.on('error', (err)=>{
            console.log("db connection error : ");
            console.log(err);
            process.exit();        
        })
    } catch (error:any) {
        console.log("Some error occured while connecting :");
        console.log(error.message);
        
    }
}




