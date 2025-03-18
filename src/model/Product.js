import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
    required: [true, "Admin id is required for product addition"],
  },
  productName: {
    type: String,
    required: false,
  },
  productDescription: {
    type: String,
    required: false,
  },
  productColor: {
    type: String,
    required: false,
  },
  productPrice: {
    type: Number,
    required: false,
  },
  productStock: {
    type: String,
    required: false,
  },
  productCategory: {
    type: String,
    required: false,
  },
  productModel: {
    type: String,
    required: false,
  },

});

productSchema.index({ productCategory: 'text' }, { name:'productCategory_text'});
const Product = new mongoose.model("Product", productSchema);

export default Product;
