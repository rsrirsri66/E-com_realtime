// CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cart');
      setCart(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/cart', product, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token here
        },
      });
      console.log('Product added to cart:', response.data);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${id}`);
      setCart(prevCart => prevCart.filter(product => product.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, product) => total + parseFloat(product.price), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
