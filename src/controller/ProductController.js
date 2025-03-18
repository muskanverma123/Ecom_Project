import Product from "../model/Product.js";
import Admin from "../model/Admin.js";
import { Document } from "mongoose";
//add product
export const addProduct = async (req, res) => {
  try {
    const checkProduct = await Product.findOne({
      $or: [
        { productName: req.body.productName },
        { productModel: req.body.productModel },
      ],
    });
    if (checkProduct) {
      if (checkProduct.productName == req.body.productName) {
        return res.json({
          status: 400,
          message: "this product name already used",
          data: [],
        });
      } else if (checkProduct.productModel == req.body.productModel) {
        return res.json({
          status: 400,
          message: "this  product model already used",
          data: [],
        });
      }
    }
    const adminId = req.admin;

    const findSuperAdmin = await Admin.findOne({
      _id: adminId,
      isVerified: true,
    });

    if (!findSuperAdmin) {
      return res.json({
        status: 400,
        message: " admin is not found",
        data: [],
      });
    }
    if (
      findSuperAdmin.adminrole == "superadmin" ||
      findSuperAdmin.adminrole == "subadmin"
    ) {
      const addProduct = new Product({
        adminId: req.body.adminId,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productColor: req.body.productColor,
        productPrice: req.body.productPrice,
        productStock: req.body.productStock,
        productCategory: req.body.productCategory,
        productModel: req.body.productModel,
      });
      const saveProduct = await addProduct.save();
      return res.json({
        status: 201,
        message: "add product successfully",
        data: saveProduct,
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};
//get all product
export const getAllProduct = async (req, res) => {
  try {
    const getAllProduct = await Product.find();
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const searchArr = {};
    if (query) {
      searchArr.productName = { $regex: query, $options: "i" };
      searchArr.productCategory = { $regex: query, $options: "i" };
      searchArr.productPrice = { $regex: query, $options: "i" };
      let minPrice = 6900.0;
      let maxPrice = 199900;
      searchArr.productPrice = {
        $gte: minPrice,
        $lte: maxPrice,
      };
    }
    const total = await Product.countDocuments(searchArr);
    const products = await Product.find(searchArr)
      .skip(startIndex)
      .limit(limit);
    return res.json({
      status: 201,
      message: "Get all product data successfully",
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};
//get  product by id
export const getProduct = async (req, res) => {
  try {

    const getProduct = await Product.findOne({ _id: req.params.id });

    return res.json({
      status: 200,
      message: "Get  product data successfully",
      data: getProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

//update  product by id
export const updateProduct = async (req, res) => {
  try {
    let adminId = req.admin;
    const findAdmin = await Admin.findOne({ _id: adminId, isVerified: true });
    if (!findAdmin) {
      return res.json({
        status: 400,
        message: " admin is not found",
        data: [],
      });
    }
    if (
      findAdmin.adminrole == "superadmin" ||
      findAdmin.adminrole == "subadmin"
    ) {
      const updateProduct = await Product.updateOne(
        { _id: req.params.id },
        { $set: { productStock: req.body.productStock } },
        { new: true }
      );

      return res.json({
        status: 200,
        message: "Update product data successfully",
        data: updateProduct,
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

// delete product by id

export const deleteProduct = async (req, res) => {
  try {
    let adminId = req.admin;
    const findAdmin = await Admin.findOne({ _id: adminId, isVerified: true });
    if (!findAdmin) {
      return res.json({
        status: 400,
        message: " admin is not found",
        data: [],
      });
    }
    if (
      findAdmin.adminrole == "superadmin" ||
      findAdmin.adminrole == "subadmin"
    ) {

      const checkProjectId = await Product.findOne({ _id: req.params.id })
      if (!checkProjectId) {
        return res.status(404).json({
          status: 404,
          message: "product is not found",
          data: []
        })
      }
      let deleteProduct = await Product.deleteOne({ _id: req.params.id });
      return res.json({
        status: 200,
        message: "Product delete successfully",
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

// product with their  order

export const ProductwithOrder = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {}
      },
      {
        $group: {
          _id: {
            productColor: "$productColor",
            productCategory: "$productCategory",
            productName: "$productName"
          },

          totalAmount: { $sum: "$productPrice" }


        }
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders"
        }
      }

    ]);

    return res.status(200).json({
      status: 200,
      message: "successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

// fech all product by thier cata base//

export const GetProductCategory = async (req, res) => {
  try {

    // await Product.createIndexes();

 
    console.log("req.body.productCategory", req.body.productCategory);

    const getProduct = await Product.findOne({
      $text: {
        $search: req.body.productCategory
      }
    });
    console.log(getProduct);

    return res.json({
      status: 200,
      message: "Get  product data successfully",
      data: getProduct,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
};

// export const GetProductCategory = async (req, res) => {
//   try {
//     if (!req.body.productCategory) {
//       return res.status(400).json({
//         status: 400,
//         message: "Product category is required",
//       });
//     }
//     const existingIndexes = await Product.collection.indexes();
//     const existingIndex = existingIndexes.find((index) => index.name === "category_text");
//     if (existingIndex) {
//       console.log("Dropping conflicting index:", existingIndex.name);
//       await Product.collection.dropIndex("category_text");
//     }
//     await Product.createIndexes();
//     const getProduct = await Product.findOne({
//       $text: {
//         $search: req.body.productCategory,
//       },
//     });

//     if (!getProduct) {
//       return res.status(404).json({
//         status: 404,
//         message: "No product found with the given category",
//       });
//     }

//     return res.json({
//       status: 200,
//       message: "Product data retrieved successfully",
//       data: getProduct,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//       data: [],
//     });
//   }
// };