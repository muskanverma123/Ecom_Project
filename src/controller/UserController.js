import User from "../model/User.js";
import Admin from "../model/Admin.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../model/Product.js";
dotenv.config();
// user register
export const userRegister = async (req, res) => {
  try {
    const checkUser = await User.findOne({
      $or: [{ email: req.body.email }, { number: req.body.number }],
    });
    if (checkUser) {
      if (checkUser.email == req.body.email) {
        return res.json({
          status: 400,
          message: "this email already used",
          data: [],
        });
      } else if (checkUser.number == req.body.number) {
        return res.json({
          status: 400,
          message: "this number already used",
          data: [],
        });
      }
    }
    let saltCount = 10;
    let userPassword = req.body.password;
    let hashPassword = await bcryptjs.hash(userPassword, saltCount);
    const addUser = new User({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      password: hashPassword,
    });
    const userRegister = await addUser.save();
    return res.json({
      status: 201,
      message: "User register successfully",
      data: userRegister,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

//user login
export const userLogin = async (req, res) => {
  try {
    let checkUser = await User.findOne({ email: req.body.email });
    if (!checkUser) {
      return res.json({
        status: 400,
        message: "user is not found",
        data: [],
      });
    }
    let userPassword = req.body.password;
    let dataPassword = checkUser.password;
    let comparePassword = await bcryptjs.compare(userPassword, dataPassword);
    if (comparePassword) {
      let payload = {
        email: checkUser.email,
        id: checkUser._id,
      };
     
      const token = await generateToken(payload)
      const refreshToken = await generateRefreshToken(payload)

      return res.json({
        status: 200,
        message: "Login successfully",
        data: checkUser,
        token: token,
        refreshToken:refreshToken
      });
    } else {
      return res.json({
        status: 400,
        message: "password is not match",
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

//user update //
export const updateUser = async (req, res) => {
  try {
    let checkUser = await User.findOne({ _id: req.body.id });
    if (!checkUser) {
      return res.json({
        status: 400,
        message: " user not found",
        data: [],
      });
    }
    let updateUser = await User.updateOne(
      { _id: req.body.id },
      { $set: { number: req.body.number } },
      { new: "true" }
    );
    return res.json({
      status: 200,
      message: "user data update successfully",
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

//get all user //
export const getAllUser = async (req, res) => {
  try {
    const adminId = req.admin;
    const findAdmin = await Admin.findOne({ _id: adminId, isVerified: true });
    if (!findAdmin) {
      return res.json({
        status: 400,
        message: "admin not found",
        data: [],
      });
    }
    if (
      findAdmin.adminrole == "superadmin" ||
      findAdmin.adminrole == "subadmin"
    ) {
      let getAllUser = await User.find();
      return res.json({
        status: 200,
        message: " get all user data  successfully",
        data: getAllUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

//get one user //
export const getOneUser = async (req, res) => {
  try {
    const adminId = req.admin;
    const findAdmin = await Admin.findOne({ _id: adminId, isVerified: true });
    if (!findAdmin) {
      return res.json({
        status: 400,
        message: "admin not found",
        data: [],
      });
    }
    if (
      findAdmin.adminrole == "superadmin" ||
      findAdmin.adminrole == "subadmin"
    ) {
      let getOneUser = await User.findOne({ _id: req.body.id });
      return res.json({
        status: 200,
        message: " get user data  successfully",
        data: getOneUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

//get user with order
export const getUserwithOrder = async (req, res) => {
  try {
    const users = await User.aggregate([
      // const users = await Product.aggregate
      // {
      //   $match :{_id:new mongoose.Types.ObjectId("67b6c016b59de23dfe6f038f")}
      // },
      {
        $match: {},
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $unwind: "$orders",
      },
      // {
      //   $group: {
      //     _id: "$productCategory",
      //     totalAmount: { $sum: "$productPrice" }
      //   }
      //  }

      // {
      //   $project: {
      //     _id: 0,
      //     name: 1,
      //     orders: {
      //       totalPrice: 1,
      //       productDescription: 1,
      //     },
      //   },
      // },
      {
        $sort: {
          name: 1,
        },
      },
      // {
      //   $limit:1
      // },
    ]);
    return res.status(200).json({
      status: 200,
      message: "Match count",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

//generatetoken function
export const generateToken = (payload) => {
  try{
    console.log(process.env.SECRET_KEY,"SSSSSSSSSSSSSSSSSSSSS")
    const token = jwt.sign(payload,process.env.SECRET_KEY, {
      expiresIn: "1h",
    })
    return token;
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}

// generateRefreshToken
export const generateRefreshToken = (payload) => {
  try{
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "30d",
    })
    return refreshToken;
  }catch(error){
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}


//refreshToken 
export const refreshToken = async(req,res)=>{
  try{
      const {refreshToken} = req.body
      const{id,email} =  jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY)
      const token = await generateToken({id,email})
      return res.status(200).json({
        status : 200,
        message : "Token refresh success",
        token:token
      })
  }catch(error){
    console.log(error)
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
}









