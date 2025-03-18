import  mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const connectDb = async()=>{
    try{
        let mongo_url = process.env.MONGO_URL
        await mongoose.connect(mongo_url)
        console.log("data base is connect")
    }catch(error){
           console.log(error)
    }
}

export default connectDb