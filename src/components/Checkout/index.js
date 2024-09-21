import React, { useState, useContext } from 'react';
import CartContext from '../../context/CartContext';
import { supabase } from '../../supabaseClient';
import Header from "../Header";
import './index.css';
import { useNavigate } from 'react-router-dom'; // useNavigate for navigation

const Checkout = () => {
    const { cartList, setCartList } = useContext(CartContext);
  
    const navigate = useNavigate(); // For navigation
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        address: '',
        pincode: '',
        mobile: '',
        email: '',
    });

    const [paymentStatus, setPaymentStatus] = useState(null); // Track the payment status
  

    const totalAmount = cartList.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value,
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        // Configure Razorpay payment options
        const options = {
            key: "rzp_test_DsF74aFK3tK8qH", // Your Razorpay key
            amount: totalAmount * 100, // Amount in paise
            currency: "INR",
            name: "Your Store Name",
            description: "Order Payment",
            handler: async (response) => {
                // Payment success, save order with 'success' status
                const savedOrder = await saveOrderData(userDetails, response.razorpay_payment_id, 'success');
                if (savedOrder) {
                    setPaymentStatus('success'); // Set payment status to success
                    setCartList([])
                } else {
                    alert("Failed to save order details. Please try again.");
                }
            },
            modal: {
                ondismiss: async () => {
                    alert("Payment process was dismissed");
                    // Save order with 'failure' status if dismissed
                    await saveOrderData(userDetails, null, 'failure');
                    setPaymentStatus('failure'); // Set payment status to failure
                }
            },
            theme: {
                color: "#F37254",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', async (response) => {
            console.error("Payment failed:", response);
            // Save order with 'failure' status in case of payment failure
            const savedOrder = await saveOrderData(userDetails, null, 'failure');
            setPaymentStatus('failure'); // Set payment status to failure
        });
    };

    const saveOrderData = async (userDetails, paymentId, status) => {
        const cartItems = cartList.map(item => ({
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity
        }));


        const { data, error } = await supabase
            .from('orders')
            .insert([{
                first_name: userDetails.firstName,
                last_name: userDetails.lastName,
                address: userDetails.address,
                pincode: userDetails.pincode,
                mobile: userDetails.mobile,
                email: userDetails.email,
                payment_id: paymentId, // Save payment ID or null if failed/dismissed
                amount: totalAmount,
                status: status, // Save 'success' or 'failure'
                cart_items: cartItems
            }])
            .single();

        if (error) {
            console.error("Error saving order:", error.message || error);
            return false; // Failed to save order
        } else {
            console.log("Order saved successfully:", data);
            return true; // Successfully saved order
        }
    };

    const handleShopNow = () => {
        navigate('/products'); // Navigate to shop page
      
    };

    const handleTryAgain = () => {
        setPaymentStatus(null); // Reset payment status and try again
    };

    // Conditionally render based on payment status
    return (
        <>
            <Header />
            <div className="checkout-container">
                <h2>Checkout</h2>

                {paymentStatus === 'success' ? (
                    <div className="payment-success">
                        <h3>Order Placed Successfully!</h3>
                        <button onClick={handleShopNow}>Shop Now</button>
                    </div>
                ) : paymentStatus === 'failure' ? (
                    <div className="payment-failed">
                        <h3>Payment Failed. Please try again.</h3>
                        <button onClick={handleTryAgain}>Try Again</button>
                    </div>
                ) : (
                    <form onSubmit={handlePayment}>
                        <input
                            name="firstName"
                            placeholder="First Name"
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="lastName"
                            placeholder="Last Name"
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="address"
                            placeholder="Address"
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="pincode"
                            placeholder="Pincode"
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="mobile"
                            placeholder="Mobile Number"
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Proceed to Pay</button>
                    </form>
                )}

                {paymentStatus === null && (
                    <>
                        <h3>Order Summary</h3>
                        <ul>
                            {cartList.map((item) => (
                                <li key={item.id}>
                                    {item.name} - ₹{item.price} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                        <h4>Total Amount: ₹{totalAmount}</h4>
                    </>
                )}
            </div>
        </>
    );
};

export default Checkout;
