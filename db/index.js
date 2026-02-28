import mongoose from "mongoose";
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(
            `${process.env.MONGO_URI}/${process.env.DB_NAME}`
        );
        console.log("MongoDB is connected",conn.connection.host);

    }
    catch(error){
        console.error("MongoDB connection failed",error.message);
        process.exit(1);

    }
}
export default connectDB;