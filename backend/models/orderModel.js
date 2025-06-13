import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      product: { type: Number, required: true }, // <== Fix this
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  shippingInfo: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  totalAmount: Number,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
