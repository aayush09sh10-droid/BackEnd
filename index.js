import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();

const PORT = process.env.PORT || 7000;

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running at localhost:${PORT}`)

    })
}).catch((err) => {
    console.log("DB connection error ", err);
});