import Router from "express"
import Authmiddleware from "../middleware/Auth.js"
import {subAdminRegister,adminLogin,getAllSubAdmin,getOneSubAdmin, updateOneSubAdmin,deleteOneSubAdmin,
        refreshToken} from "../controller/AdminController.js"
const adminRoute = Router()
adminRoute.post("/subAdminRegister",Authmiddleware,subAdminRegister)
adminRoute.post("/adminLogin",adminLogin)
adminRoute.get("/getAllSubAdmin",Authmiddleware,getAllSubAdmin)
adminRoute.get("/getOneSubAdmin",Authmiddleware,getOneSubAdmin)
adminRoute.put("/updateOneSubAdmin/:id",Authmiddleware,updateOneSubAdmin)
adminRoute.delete("/deleteOneSubAdmin/:id",Authmiddleware,deleteOneSubAdmin)
adminRoute.post("/refresh-token",refreshToken)
export default adminRoute