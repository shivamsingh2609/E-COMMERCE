import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const { cart, shippingInfo, totalAmount } = req.body;

  if (!cart || cart.length === 0 || !shippingInfo || !totalAmount) {
    res.status(400);
    throw new Error('Missing required order fields');
  }

  try {
    const orderItems = cart.map((item, index) => {
      if (!item.productId && !item.id) {
        throw new Error(`Missing productId for item at index ${index}`);
      }

      return {
       product: item.productId ?? item.id ?? item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || item.thumbnail || '',
      };
    });

    console.log('Creating order with:', {
      user: req.user._id,
      orderItems,
      shippingInfo,
      totalAmount,
    });

    const order = new Order({
      user: req.user._id,
      orderItems,
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
