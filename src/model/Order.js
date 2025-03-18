import mongoose from "mongoose";
// Fields: id, userId, products (array of product IDs and quantities), totalPrice,
//  status (pending, shipped, delivered), createdAt, updatedAt.
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A order must have a User Id."],
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "An order must belong to a product."],
  },
  productQuantities: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: false,
  },
  totalPrice: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: false,
  },
  updatedAt: {
    type: String,
    required: false,
  },
});

const Order = new mongoose.model("Order", orderSchema);
export default Order;
