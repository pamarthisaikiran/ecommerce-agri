import React from 'react';
import { useContext } from 'react';
import CartContext from '../../context/CartContext';
import Header from "../Header";
import { useNavigate } from 'react-router-dom';

import './index.css'; // Import the CSS file

const Cart = () => {
    const { cartList, removeCartItem, updateCartItemQuantity } = useContext(CartContext);
    const navigate = useNavigate();
   
    const totalAmount = cartList.reduce((total, item) => total + item.price * item.quantity, 0);

    const incrementQuantity = (id) => {
        const item = cartList.find(item => item.id === id);
        updateCartItemQuantity(id, item.quantity + 1);
    };

    const decrementQuantity = (id) => {
        const item = cartList.find(item => item.id === id);
        if (item.quantity > 1) {
            updateCartItemQuantity(id, item.quantity - 1);
        }
    };

    const removeItem = (id) => {
        removeCartItem(id);
    };

    const handleCheckout = () => {
        // Handle the checkout process here (e.g., redirect to checkout page)
        console.log("Proceeding to checkout...");
    };

    return (
        <>
            <Header />
            <div className="cart-container">
                <h2>Shopping Cart</h2>
                {cartList.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                ) : (
                    cartList.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>Price: ₹{item.price}</p>
                                <p>Quantity: {item.quantity} ({item.weightInGrams}g)</p> {/* Display weight in grams */}
                                <p>₹ {item.price * item.quantity}{/* individual total amount */}</p>
                            </div>
                            <div className="cart-item-actions">
                                <button onClick={() => incrementQuantity(item.id)}>+</button>
                                <button onClick={() => decrementQuantity(item.id)}>-</button>
                                <button onClick={() => removeItem(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))
                )}
                <h3 className="total-amount">Total Amount: ₹{totalAmount}</h3>
                {cartList.length > 0 && (
                    <div>
                   <button onClick={() => navigate('/checkout')}>Checkout</button> {/* Use navigate here */}
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
