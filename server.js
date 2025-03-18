import express from 'express'
const app = express()
app.use(express.json())
import connectDb from "./src/config/ConnectDb.js"
import userRoute from './src/routes/UserRoute.js'
import adminRoute from "./src/routes/AdminRoute.js"
import orderRoute from "./src/routes/OrderRoute.js"
import productRoute from "./src/routes/ProductRoute.js"
import dotenv from "dotenv"
dotenv.config()
app.use("/user",userRoute)
app.use("/admin",adminRoute)
app.use("/product",productRoute)
app.use("/order",orderRoute)
const  port = process.env.PORT

app.listen(port,()=>{
    connectDb()
    console.log("server is running on port 9000")
})