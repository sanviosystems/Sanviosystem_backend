import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        mobile: String,
        address: String,
        pincode: String,
        productName: String,
        productPrice: Number,
        productImage: String,
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
