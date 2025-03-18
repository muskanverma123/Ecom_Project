import mongoose from "mongoose"


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },email:{
        type:String,
        required:false
    },number:{
        type:String,
        required:false
    },password:{
        type:String,
        required:false
    },isDelete:{
        type:Boolean,
        default:false
    },isVerified:{
        type:Boolean,
        default:false
    }
})
const User = new mongoose.model("User", UserSchema)

export default User