import mongoose from "mongoose"
import { MONGO_URI } from "."

const ConnectDB =async ()=>{
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("Failed to connect to MongoDB")
        process.exit(1)
    }
}

export default ConnectDB