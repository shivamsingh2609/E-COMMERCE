
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const { cart, shippingInfo, totalAmount } = req.body;

  if (!cart || cart.length === 0 || !shippingInfo || !totalAmount) {
    res.status(400);
    throw new Error('Missing required order fields');
  }

  try {
    console.log('Creating order with data:', {
      user: req.user._id,
      cart,
      shippingInfo,
      totalAmount,
    });

    const order = new Order({
      user: req.user._id,
      orderItems: cart.map((item) => ({
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || item.thumbnail,
      })),
      shippingInfo,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation failed:', error.message);
    res.status(500).json({ message: error.message });
  }
});
