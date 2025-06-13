import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartItemQuantity = useStore((state) => state.updateCartItemQuantity);
  const clearCart = useStore((state) => state.clearCart);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          Your cart is empty.{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Shop now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || item.thumbnail}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <button
                  onClick={() =>
                    updateCartItemQuantity(item.productId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  -
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartItemQuantity(item.productId, item.quantity + 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800">
              Total: ₹{total.toFixed(2)}
            </h3>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
                <Link to="/checkout" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Proceed to Checkout
                </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
