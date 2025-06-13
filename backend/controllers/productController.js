import { v2 as cloudinary } from 'cloudinary';
import Product from './../models/Product.js';
import { upload } from './../configs/multer.js';

export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData); // Parse form data
    const images = req.files;

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // Save to database
    const savedProduct = await Product.create({
  ...productData,
  images: imagesUrl,
  offerPrice: Number(productData.offerPrice) || 0
});


    console.log("✅ Final Product Saved:");
    console.log("Name:", savedProduct.name);
    console.log("Images:", savedProduct.images);
    
    res.json({ success: true, message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.log("❌ Error in addProduct:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log("❌ Error in productList:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log("❌ Error in productById:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock updated successfully" });
  } catch (error) {
    console.log("❌ Error in changeStock:", error.message);
    res.json({ success: false, message: error.message });
  }
};
