import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../Header"
import CartContext from '../../context/CartContext'
import './index.css'; // Import the CSS file

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState('price_250g');
  const [cartQuantity, setCartQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const supabaseUrl = 'https://rdotingdflwbvuuhkprj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkb3RpbmdkZmx3YnZ1dWhrcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNDQ3MzUsImV4cCI6MjA0MTcyMDczNX0.4bD0pIZvmFGZI3ZmTVVeXgt9pkd6SoCBsLYx3_K0qXk'; // Replace with your Supabase Anon Key

  const { addCartItem } = useContext(CartContext);
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setProduct(data[0]);
      if (data[0]) {
        setPrice(data[0][selectedQuantity]);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product) {
      setPrice(product[selectedQuantity]);
    }
  }, [selectedQuantity, product]);

  const handleQuantityChange = (newQuantity) => {
    setSelectedQuantity(newQuantity);
    setCartQuantity(1);
  };

  const incrementQuantity = () => {
    setCartQuantity(cartQuantity + 1);
  };

  const decrementQuantity = () => {
    if (cartQuantity > 1) {
      setCartQuantity(cartQuantity - 1);
    }
  };
  const { cartList } = useContext(CartContext);
  const addToCart = () => {
    // Determine the weight in grams based on the selected quantity
    const weightInGrams = selectedQuantity === 'price_250g' ? 250 : 
                          selectedQuantity === 'price_500g' ? 500 : 
                          selectedQuantity === 'price_1kg' ? 1000 : 0;
  
    // Check how many of this product already exist in the cart
    const existingProduct = cartList.find(item => item.id === product.id && item.selectedQuantity === selectedQuantity);
    const totalQuantity = existingProduct ? existingProduct.quantity + cartQuantity : cartQuantity;
  
    console.log(`Added ${cartQuantity} of ${product.name} (${selectedQuantity}) - Total grams: ${weightInGrams * totalQuantity}g to cart. Total quantity in cart: ${totalQuantity} at ₹${price * totalQuantity}`);
    
    addCartItem({ 
      id: product.id, 
      name: product.name, 
      price, 
      quantity: cartQuantity, 
      image: product.image, 
      selectedQuantity, 
      weightInGrams // Add the weightInGrams to the item
    });
  };
  
  

  if (!product) return <p>Loading...</p>;

  return (
    <>
    <Header/>
    <div className="product-details-container">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>Price: ₹{price}</p>
        <div className="quantity-buttons">
          <button className={selectedQuantity === 'price_250g' ? 'active' : ''} onClick={() => handleQuantityChange('price_250g')}>250g</button>
          <button className={selectedQuantity === 'price_500g' ? 'active' : ''} onClick={() => handleQuantityChange('price_500g')}>500g</button>
          <button className={selectedQuantity === 'price_1kg' ? 'active' : ''} onClick={() => handleQuantityChange('price_1kg')}>1kg</button>
        </div>
        <div className="cart-controls">
          <button onClick={decrementQuantity}>-</button>
          <span>{cartQuantity}</span>
          <button onClick={incrementQuantity}>+</button>
        </div>
        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
