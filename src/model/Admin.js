import mongoose from "mongoose"
// Fields: id, name, email, password, role (admin or customer), createdAt, updatedAt.

const AdminSchema = new mongoose.Schema({
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
    },adminrole:{
        type:String,
        required:false
    },isVerified:{
        type:Boolean,
        default:false
    }
})

const Admin = new mongoose.model("Admin",AdminSchema)

export default Admin