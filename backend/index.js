import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRouter.js";
import orderRoute from "./routes/orderRoute.js";
import instamojoRoute from "./routes/instamojoRoute.js";

const app = express();
const port = process.env.PORT || 4000;

connectCloudinary();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRoute);
app.use('/api/instamojo', instamojoRoute);

app.get('/', (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
