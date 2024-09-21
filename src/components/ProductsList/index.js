import React, { useEffect, useState } from 'react';
import {Link } from "react-router-dom"
import Header from "../Header"
import './index.css'; // Import your CSS for styling

const supabaseUrl = 'https://rdotingdflwbvuuhkprj.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkb3RpbmdkZmx3YnZ1dWhrcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNDQ3MzUsImV4cCI6MjA0MTcyMDczNX0.4bD0pIZvmFGZI3ZmTVVeXgt9pkd6SoCBsLYx3_K0qXk'; // Replace with your Supabase Anon Key

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch products from Supabase using Fetch API
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://rdotingdflwbvuuhkprj.supabase.co/rest/v1/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
    <Header />
    <div className="products-container">
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="products-grid">
        {products.map(product => (
       <Link to={`/products/${product.id}`} >  <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <img src={product.image} alt={product.name} width="100" />
            <p>Price Starting from ₹{product.price_250g} </p>
            <p>Stock: {product.stock}</p>
          </div> </Link> 
        ))}
      </div>
    </div>
    </>
  );
};

export default ProductsList;
