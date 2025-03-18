import Router from "express"
import Authmiddleware from "../middleware/Auth.js"
import {userRegister,updateUser,getAllUser,getOneUser,userLogin 
    ,getUserwithOrder,refreshToken} from "../controller/UserController.js"
const userRoute = Router()
userRoute.post("/userRegister",userRegister)
userRoute.put("/updateUser/:id",updateUser)
userRoute.post("/userLogin",userLogin)
userRoute.get("/getAllUser",Authmiddleware,getAllUser)
userRoute.get("/getOneUser/:id",Authmiddleware,getOneUser)
userRoute.get("/get-all-user-order",getUserwithOrder)
userRoute.post("/refresh-token",refreshToken)
export default userRoute