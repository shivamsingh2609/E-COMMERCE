import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

function Navbar() {
  const cart = useStore((state) => state.cart || []);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const userInfo = useStore((state) => state.userInfo);
  const logout = useStore((state) => state.logout);
  const clearCart = useStore((state) => state.clearCart);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      logout();              // ✅ Clear user from store
      clearCart({ skipSync: true }); // ✅ Clear cart without syncing
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      logout();              // Fallback
      clearCart({ skipSync: true }); // Even on error, don't sync
    }
  };


  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-teal-400 hover:text-teal-300">
          🛒 ShopZone
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-teal-300 transition">Home</Link>

          <Link to="/cart" className="relative hover:text-teal-300 transition">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {userInfo ? (
            <>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
              <Link to="/profile" className="hover:text-teal-300 transition">
                👤 {userInfo.name || 'Profile'}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-teal-300 transition">Login</Link>
              <Link to="/register" className="hover:text-teal-300 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
