import Router from "express"
import Authmiddleware from "../middleware/Auth.js"
import{addProduct ,getAllProduct,getProduct,updateProduct,deleteProduct,
    ProductwithOrder,GetProductCategory} from '../controller/ProductController.js'
const productRoute = Router()
productRoute.post("/addProduct",Authmiddleware,addProduct)
productRoute.get("/getAllProduct",getAllProduct)
productRoute.get("/getProduct/:id",getProduct)
productRoute.put("/updateProduct/:id",Authmiddleware,updateProduct)
productRoute.delete("/deleteProduct/:id",Authmiddleware,deleteProduct)
productRoute.get("/ProductwithOrder",ProductwithOrder)
productRoute.get("/GetProductCategory",GetProductCategory)
export default  productRoute 