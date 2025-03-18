import Router from "express"
import Authmiddleware from "../middleware/Auth.js"
import {addOrder,getAllOrder,getOneOrder,updateOrder} from "../controller/OrderController.js"

const orderRoute = Router()
orderRoute.post("/addOrder",addOrder)
orderRoute.get("/getAllOrder",Authmiddleware,getAllOrder)
orderRoute.get("/getOneOrder",getOneOrder)
orderRoute.put("/updateOrder/:id",Authmiddleware,updateOrder)

export default orderRoute