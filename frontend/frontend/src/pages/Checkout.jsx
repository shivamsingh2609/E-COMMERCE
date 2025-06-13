import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const cart = useStore((state) => state.cart);
  const userInfo = useStore((state) => state.userInfo);
  const clearCart = useStore((state) => state.clearCart);
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  console.log('Sending order payload:', {
  cart,
  shippingInfo,
  totalAmount: total,
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };
const handleOrder = async () => {
  if (!userInfo) {
    return navigate('/login');
  }

  if (!shippingInfo.fullName || !shippingInfo.address) {
    return setError('Please complete all shipping fields.');
  }

  setLoading(true);
  setError('');
  setSuccessMessage('');

  const payload = {
    cart: cart.map((item) => ({
      product: item.productId, // ✅ rename this key!
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    shippingInfo,
    totalAmount: total,
  };

  console.log("Sending order payload:", payload);

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Order failed');
    }

    setSuccessMessage('🎉 Order placed successfully!');
    clearCart();
    setTimeout(() => navigate('/'), 3000);
  } catch (err) {
    setError(err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🧾 Checkout</h2>

      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty. Add items before checkout.</div>
      ) : (
        <>
          {/* Shipping Form */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={shippingInfo.fullName}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingInfo.country}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id || item.productId} className="flex justify-between items-center border-b py-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {successMessage && <div className="text-green-600 mb-2">{successMessage}</div>}
          <button
            onClick={handleOrder}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
