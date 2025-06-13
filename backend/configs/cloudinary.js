import pkg from 'cloudinary'; // Import the whole CommonJS module
const cloudinary = pkg.v2;  

const connectCloudinary = async() =>{
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    })
}

export default connectCloudinary;