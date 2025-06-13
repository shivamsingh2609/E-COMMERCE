import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import PrivateRoute from "./components/PrivateRoute";
import CheckoutPage from "./pages/Checkout";


function App() {
  

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          < Navbar/>
          <main className="container mx-auto px-4 py-8">
            <Routes>
              
              <Route path="/" element={<ProductList />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/cart" element={<CartPage />} />
               <Route path="/product/:id" element={<ProductDetail />} />
               <Route path="/checkout" element={<CheckoutPage />} />

               {/* <Route path="/profile" element={
  <PrivateRoute>
    <ProfilePage />
  </PrivateRoute>
} /> */}
              {/* <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} /> */}
            </Routes>
          </main>
          {/* <Notification /> */}
        </div>
      </Router>
    </>
  )
}

export default App
