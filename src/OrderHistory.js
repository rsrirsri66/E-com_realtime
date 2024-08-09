import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For generating tables
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; 
import logo from "./pics/elogo-removebg-preview.png";
const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
      fetchOrderHistory();
    }, []);
  
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/order-history');
        console.log('Order history response:', response.data); // Debugging line
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching order history:', err);
      }
    };
  
    const generatePDF = () => {
      const doc = new jsPDF();
  
      doc.setFontSize(16);
      doc.text('Order History', 14, 16);
  
      const tableData = orders.map(order => [
        `Order ID: ${order.order_id}`,
        `Amount: ${order.amount}`,
        `Currency: ${order.currency}`,
        `Status: ${order.status}`,
        order.items.map(item => `Name: ${item.name}, Description: ${item.description}, Price: ${item.price}`).join('; ')
      ]);
  
      doc.autoTable({
        head: [['Order ID', 'Amount', 'Currency', 'Status', 'Items']],
        body: tableData,
        startY: 20,
      });
  
      doc.save('order-history.pdf');
    };
    const goToHome = () => {
        navigate('/home'); // Navigate to the home page
      };

    return (
        <div className='sass3'>
        <div className='order-history-container'>
          <h2>Order History</h2>
          <div className="home-icon" onClick={goToHome}>
        <FaHome size={30} />
      </div>
          <button onClick={generatePDF}>Download as PDF</button>
          <div className="order-history">
         
            {orders.map(order => (
              <div key={order.order_id} className="order-item">
                <img
        src={logo}
        alt="Your Brand"
        className="order-logo" /* Apply the class for styling */
      />
                <h3>Order ID: {order.order_id}</h3>
                <p>Amount: {order.amount}</p>
                <p>Currency: {order.currency}</p>
                <p>Status: <span className={`status ${order.status}`}>{order.status}</span></p>
                
               <ul>
                  {order.items && order.items.map(item => (
                    <li key={item.product_id} className="order-item-details">
                      <img src={item.imgsrc} alt={item.name} onError={(e) => console.log('Image error:', e.target.src)} />
                      <div className="item-details">
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                        <p><strong>Price:</strong> {item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

export default OrderHistory;
