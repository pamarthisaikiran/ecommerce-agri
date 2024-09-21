/* import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import './index.css'; // Import the CSS file

const AdminProductForm = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // State to hold the order data
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('in stock');
  const [description, setDescription] = useState('');
  const [price250g, setPrice250g] = useState('');
  const [price500g, setPrice500g] = useState('');
  const [price1kg, setPrice1kg] = useState('');
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // State for managing which product is being edited

  // Fetch products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
  };

  // Fetch orders and user details
  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id, 
        payment_id, 
        status, 
        first_name, 
        last_name, 
        address,
        pincode,
        mobile,
        email,
        amount,
        cart_items
      `);
    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    } else {
      setOrders(ordersData);
    }
    console.log(ordersData)
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders(); // Fetch orders when the component loads
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    const productData = {
      name,
      image,
      stock,
      description,
      price_250g: parseFloat(price250g),
      price_500g: parseFloat(price500g),
      price_1kg: parseFloat(price1kg),
    };

    console.log('Inserting product data:', productData);

    if (editingId) {
      // Update existing product
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingId);

      if (error) {
        console.error('Update error:', error);
        setError('Error updating data: ' + JSON.stringify(error));
      } else {
        alert('Product updated successfully!');
        resetForm();
      }
    } else {
      // Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        console.error('Insert error:', error);
        setError('Error inserting data: ' + JSON.stringify(error));
      } else {
        alert('Product added successfully!');
        resetForm();
      }
    }
    fetchProducts(); // Refresh the product list
  };

  const resetForm = () => {
    setName('');
    setImage('');
    setStock('in stock');
    setDescription('');
    setPrice250g('');
    setPrice500g('');
    setPrice1kg('');
    setEditingId(null); // Reset editing state
  };

  const handleEdit = (product) => {
    setName(product.name);
    setImage(product.image);
    setStock(product.stock);
    setDescription(product.description);
    setPrice250g(product.price_250g);
    setPrice500g(product.price_500g);
    setPrice1kg(product.price_1kg);
    setEditingId(product.id); // Set the product ID being edited
  };

  const handleUpdateStock = async (id, newStock) => {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    if (error) {
      console.error('Error updating stock:', error);
    } else {
      fetchProducts(); // Refresh the product list
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      alert('Product deleted successfully!');
      fetchProducts(); // Refresh the product list
    }
  };

  return (
    <div className="container">
      <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
       
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <select
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        >
          <option value="in stock">In Stock</option>
          <option value="out of stock">Out of Stock</option>
        </select>
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price for 250g"
          value={price250g}
          onChange={(e) => setPrice250g(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price for 500g"
          value={price500g}
          onChange={(e) => setPrice500g(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price for 1kg"
          value={price1kg}
          onChange={(e) => setPrice1kg(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      
      <h2>Current Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div className="product-item" key={product.id}>
            <h3>{product.name}</h3>
            <img src={product.image} alt={product.name} className="product-image" />
            <p>{product.description}</p>
            <p>Stock: {product.stock}</p>
            <div className='but'>
              <button onClick={() => handleUpdateStock(product.id, product.stock === 'in stock' ? 'out of stock' : 'in stock')}>
                Mark as {product.stock === 'in stock' ? 'Out of Stock' : 'In Stock'}
              </button>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
            <p>Prices:</p>
            <p>250g: {product.price_250g}</p>
            <p>500g: {product.price_500g}</p>
            <p>1kg: {product.price_1kg}</p>
          </div>
        ))}
      </div>

      <h2>Order Details</h2>
<div className="order-list">
  {orders.map(order => (
    <div className="order-item" key={order.id}>
      <h3>Order ID: {order.id}</h3>
      <p>Payment ID: {order.payment_id}</p>
      <p>Status: {order.status}</p>
      <p>Amount: {order.amount}</p>

      <h4>User Details</h4>
      <p>Name: {order.first_name} {order.last_name}</p>
      <p>Address: {order.address}</p>
      <p>Pincode: {order.pincode}</p>
      <p>Mobile: {order.mobile}</p>
      <p>Email: {order.email}</p>

      <h4>Cart Items:</h4>
      {Array.isArray(order.cart_items) && order.cart_items.length > 0 ? (
        order.cart_items.map((item, index) => (
          <div key={index} className="cart-item">
            <p>Product ID: {item.product_id},</p>
            <p>Product Name:{item.product_name},</p>
            <p>Price: {item.price},</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>No cart items found.</p>
      )}
    </div>
  ))}
</div>


    </div>
  );
};

export default AdminProductForm; */

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns'; // Import format from date-fns
import { supabase } from '../../supabaseClient';
import './index.css'; // Import the CSS file
import DatePicker from 'react-datepicker'; // Add a date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for the date picker

const AdminProductForm = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('in stock');
  const [description, setDescription] = useState('');
  const [price250g, setPrice250g] = useState('');
  const [price500g, setPrice500g] = useState('');
  const [price1kg, setPrice1kg] = useState('');
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    setLoading(false);
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id, 
        payment_id, 
        status, 
        first_name, 
        last_name, 
        address,
        pincode,
        mobile,
        email,
        amount,
        cart_items,
        created_at
      `);
    setLoading(false);
    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    } else {
      setOrders(ordersData);
      setFilteredOrders(ordersData); // Initialize filtered orders
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0); // Set to start of the day
  
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to end of the day
  
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startOfDay && orderDate <= endOfDay; // Check if order date is within the selected day
      });
  
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // Show all orders if no date is selected
    }
  }, [selectedDate, orders]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const productData = {
      name,
      image,
      stock,
      description,
      price_250g: parseFloat(price250g),
      price_500g: parseFloat(price500g),
      price_1kg: parseFloat(price1kg),
    };

    if (editingId) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingId);

      if (error) {
        console.error('Update error:', error);
        setError('Error updating data: ' + JSON.stringify(error));
      } else {
        alert('Product updated successfully!');
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        console.error('Insert error:', error);
        setError('Error inserting data: ' + JSON.stringify(error));
      } else {
        alert('Product added successfully!');
        resetForm();
      }
    }
    fetchProducts();
  };

  const resetForm = () => {
    setName('');
    setImage('');
    setStock('in stock');
    setDescription('');
    setPrice250g('');
    setPrice500g('');
    setPrice1kg('');
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setName(product.name);
    setImage(product.image);
    setStock(product.stock);
    setDescription(product.description);
    setPrice250g(product.price_250g);
    setPrice500g(product.price_500g);
    setPrice1kg(product.price_1kg);
    setEditingId(product.id);
  };

  const handleUpdateStock = async (id, newStock) => {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    if (error) {
      console.error('Error updating stock:', error);
    } else {
      fetchProducts();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      alert('Product deleted successfully!');
      fetchProducts();
    }
  };

  const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
   
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    return istDate.toLocaleString('en-IN', { hour12: true });
  } 

  return (
    <div className="container">
      <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Product form inputs */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <select
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        >
          <option value="in stock">In Stock</option>
          <option value="out of stock">Out of Stock</option>
        </select>
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price for 250g"
          value={price250g}
          onChange={(e) => setPrice250g(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price for 500g"
          value={price500g}
          onChange={(e) => setPrice500g(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price for 1kg"
          value={price1kg}
          onChange={(e) => setPrice1kg(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Date Picker for filtering orders */}
      <h2>Filter Orders by Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd"
      />
      <p>Order Count: {filteredOrders.length}</p>

      {/* Product list */}
      <h2>Current Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div className="product-item" key={product.id}>
            <h3>{product.name}</h3>
            <img src={product.image} alt={product.name} className="product-image" />
            <p>{product.description}</p>
            <p>Stock: {product.stock}</p>
            <div className='but'>
              <button onClick={() => handleUpdateStock(product.id, product.stock === 'in stock' ? 'out of stock' : 'in stock')}>
                Mark as {product.stock === 'in stock' ? 'Out of Stock' : 'In Stock'}
              </button>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
            <p>Prices:</p>
            <p>250g: {product.price_250g}</p>
            <p>500g: {product.price_500g}</p>
            <p>1kg: {product.price_1kg}</p>
          </div>
        ))}
      </div>

      <h2>Order Details</h2>
      <div className="order-list">
        {filteredOrders.map(order => (
          <div className="order-item" key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p>Date: {convertToIST(order.created_at)}</p>
            <p>Payment ID: {order.payment_id}</p>
            <p>Status: {order.status}</p>
            <p>Amount: {order.amount}</p>

            <h4>Customer Details:</h4>
            <p>Name: {order.first_name} {order.last_name}</p>
            <p>Address: {order.address}, {order.pincode}</p>
            <p>Mobile: {order.mobile}</p>
            <p>Email: {order.email}</p>

            <h4>Cart Items:</h4>
            {order.cart_items && order.cart_items.length > 0 ? (
              order.cart_items.map((item, index) => (
                <div key={index} className="cart-item">
                <p>Product ID: {item.product_id},</p>
                <p>Product Name:{item.product_name},</p>
                <p>Price: {item.price},</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              ))
            ) : (
              <p>No cart items found.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductForm;
