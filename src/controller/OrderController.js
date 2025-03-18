import Order from "../model/Order.js";
import Admin from "../model/Admin.js";
import { Document } from "mongoose";

//Create an order

export const addOrder = async (req, res) => {
  try {
    const addOrder = new Order({
      userId: req.body.userId,
      productId: req.body.productId,
      productQuantities: req.body.productQuantities,
      productDescription: req.body.productDescription,
      totalPrice: req.body.totalPrice,
      status: req.body.status,
    });
    const saveOrder = await addOrder.save();
    return res.json({
      status: 201,
      message: " order create sccessfully",
      data: saveOrder,
    });
  } catch (error) {
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
};

// Fetch all orders for admin

export const getAllOrder = async (req, res) => {
  try {
    let adminId = req.admin;
    const findSuperAdmin = await Admin.findOne({
      _id: adminId,
      isVerified: true,
    });
    if (findSuperAdmin.adminrole == "subadmin") {
      return res.json({
        status: 400,
        message: "super admin is not found",
        data: [],
      });
    }
    if (findSuperAdmin.adminrole == "superadmin") {
      let page = parseInt(req.query) || 1;
      let limit = parseInt(req.query) || 5;
      let startIndex = (page - 1) * limit;
      let total = await Order.countDocument;
      let Orders = await Order.find().skip(startIndex).limit(limit);
      return res.json({
        status: 200,
        message: "get all order data successfully",
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: Orders,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
};

//Fetch order by ID for customer

export const getOneOrder = async (req, res) => {
  try {
   
    const getOneOrder = await Order.findOne({ _id: req.params.id });
    return res.json({
      status: 200,
      message: "get  order data successfully",
      data: getOneOrder,
    });
  } catch (error) {
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
};

// Update order  status  by admin

export const updateOrder = async (req, res) => {
  try {
    const adminId = req.admin;
    const findSuperAdmin = await Admin.findOne({
      _id: adminId,
      isVerified: true,
    });
    if (findSuperAdmin.adminrole == "subadmin") {
      return res.json({
        status: 400,
        message: "super admin is not found",
        data: [],
      });
    }

    if (findSuperAdmin.adminrole == "superadmin") {
      let updateOrder = await Order.updateOne(
        { _id: req.params.id },
        { $set: { status: req.body.status } },
        { new: true }
      );
      return res.json({
        status: 200,
        message: "Order update successfully",
        data: updateOrder,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status:500,
      message:"Internal server error",
      data:[]
    })
  }
};
