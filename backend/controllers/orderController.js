import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || !items.length) {
            return res.status(400).json({ success: false, message: 'Invalid data: Address and items are required.' });
        }

        if (!Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Invalid data: Items must be an array.' });
        }

        if (items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in the order.' });
        }

        let amount = 0;
        for (const item of items) {
            try {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
                }
                amount += product.offerPrice * item.quantity;
            } catch (productError) {
                console.error("Error finding product:", productError);
                return res.status(500).json({ success: false, message: `Error finding product: ${item.product}` });
            }
        }

        // Add 2% tax to the total amount
        const tax = Math.floor(amount * 0.02);
        amount += tax;

        const paymentType = 'COD';

        const newOrder = new Order({
            userId,
            items,
            amount,
            address,
            paymentType,
        });

        await newOrder.save();

        return res.status(201).json({ success: true, message: 'Order Placed Successfully', order: newOrder });

    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ success: false, message: `Error placing order: ${error.message}` });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        let orders = await Order.find({
            userId,
            $or: [{ paymentType: 'COD' }, { isPaid: true }],
        })
        .populate({
            path: 'items.product',
            model: 'Product'
        })
        .populate('address')
        .sort({ createdAt: -1 });

        // Log populated products for debug
        console.log("Fetched orders for user:", userId);
        orders.forEach((order, index) => {
            console.log(`Order ${index + 1}:`);
            order.items.forEach((item, i) => {
                console.log(`  Item ${i + 1}:`, {
                    name: item.product?.name,
                    offerPrice: item.product?.offerPrice,
                    price: item.product?.price,
                    quantity: item.quantity
                });
            });
        });

        // Recalculate amount
        const updatedOrders = orders.map(order => {
            let total = 0;

            order.items.forEach(item => {
                const product = item.product;
                if (product) {
                    const price = typeof product.offerPrice === 'number'
                        ? product.offerPrice
                        : (typeof product.price === 'number' ? product.price : 0);
                    total += price * item.quantity;
                }
            });

            const tax = Math.floor(total * 0.02);
            total += tax;

            return {
                ...order.toObject(),
                amount: total
            };
        });

        return res.status(200).json({ success: true, orders: updatedOrders });

    } catch (error) {
        console.error("Error getting user orders:", error);
        return res.status(500).json({
            success: false,
            message: `Error getting user orders: ${error.message}`
        });
    }
};



export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: 'COD' }, { isPaid: true }],
        })
        .populate({ path: 'items.product', model: 'Product' })
        .populate('address')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, orders });

    } catch (error) {
        console.error("Error getting all orders:", error);
        return res.status(500).json({ success: false, message: `Error getting all orders: ${error.message}` });
    }
};
