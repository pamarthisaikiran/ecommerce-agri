import { HashRouter  as Router, Routes, Route } from 'react-router-dom';
import Login from './components/LoginForm';
import SignUp from './components/SignUpForm';
import AdminUi from "./components/AdminUi"
import ProductsList from './components/ProductsList';
import ProductDetails from './components/ProductDetails';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<ProductsList /> } />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/admin" element={<AdminUi />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
