import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Db connection successful')
        
    } catch (error) {
       console.log('error in mongoose',error) 
    }
}