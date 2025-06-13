import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: [String], // expecting an array like ["best"]
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offerPrice: {
    type: Number,
    required: true
  },
  images: {
    type: [String], // URLs from Cloudinary
    required: true
  },
  category: {
    type: String, // "Vegetables" or "Fruits", etc.
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
