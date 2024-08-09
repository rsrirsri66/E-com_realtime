import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles.scss";
import { FaHome } from 'react-icons/fa'; 
import logo from "./pics/elogo-removebg-preview.png"
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.get('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (err) {
      console.error(err);
    }
  };
// Function to add an item to the cart

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    setTotalAmount(total);
  };

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      await axios.delete(`http://localhost:5000/cart/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      fetchCartItems(); // Refresh cart items after deletion
    } catch (err) {
      console.error(err);
    }
  };
  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/create-order', {
        amount: totalAmount
      });
      console.log('Order Creation Response:', response.data); // Add this line
  
      const { orderId, amount, currency } = response.data;
  
      const options = {
        key: 'rzp_test_sYDXizFjDxb4Vw', // Replace with your Razorpay key
        amount: amount, // Amount in paise
        currency: currency,
        name: 'Your Company',
        description: 'Test Transaction',
        order_id: orderId,
        handler: async (response) => {
          try {
            console.log('Payment Response:', response); // Add this line
            await axios.post('http://localhost:5000/verify-payment', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
            await axios.post('http://localhost:5000/store-order', {
              cartItems: cartItems,
              orderDetails: {
                amount: totalAmount,
                currency: 'INR',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });
  
            alert('Payment Successful!');
            fetchCartItems();
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment Failed!');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed!');
    }
  };
  
const goToHome = () => {
  navigate('/home'); // Navigate to the home page
};

  return (
    <div className='sass2'>
    <h2>My Cart</h2>
    <div className="home-icon" onClick={goToHome}>
        <FaHome size={30} />
      </div>
    <div className="cart-container">
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imgsrc} className="card-img-top" alt={item.name} />
            <div className="card-body">
              <h5 className="card-title"><b>{item.name}</b></h5>
              <p className="card-text">{item.description}</p>
              <h5 className="price"><b>{item.price}</b></h5>
              <button className="btn btn-danger" onClick={() => handleRemove(item.id)}>Remove from Cart</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <h3>Total Amount: {totalAmount}</h3>
        <button className="btn btn-success" onClick={handleCheckout}>Checkout</button>
        </div>
    </div>
    <footer>
  <div class="footer-content">
    <div class="footer-logo"> <img
          src={logo}
          alt="Your Brand"
          style={{ width: '120px', height: 'auto', }} 
        /></div>
    <ul class="footer-nav">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <div class="social-icons">
      <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
      <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
      <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
      <a href="https://linkedin.com" target="_blank"><i class="fab fa-linkedin-in"></i></a>
    </div>
    <div class="footer-text">Stay Connected</div>
    <div class="footer-copy">© 2024 Your Company. All rights reserved.</div>
  </div>
</footer>
  </div>
  );
};

export default Cart;
