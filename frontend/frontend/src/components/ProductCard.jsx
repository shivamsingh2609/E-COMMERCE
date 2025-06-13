import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore'; // ✅ Import Zustand store

const ProductCard = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart); // ✅ Access addToCart function

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden h-48 bg-gray-100">
          <img
            src={product.images?.[0] || 'https://dummyjson.com/image/i/products/1/1.jpg'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.category && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col justify-between h-48">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-600 mt-1 font-medium">₹{product.price}</p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </Link>

        <button
          onClick={() => addToCart(product)} // ✅ Call addToCart here
          className="mt-4 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
