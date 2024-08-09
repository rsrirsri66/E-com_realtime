import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Carousel, Row, Col, Modal,  Navbar, Nav,  Form, Button} from 'react-bootstrap';
import { CustomPrevIcon, CustomNextIcon } from './arrowcomponent';
import img1 from "./images/banner-products/product-1.png";
import img2 from "./images/banner-products/slider-1.png";
import img3 from "./images/banner-products/slider-3.png";
import off1 from "./pics/air.png";
import off2 from "./pics/neophone.png";
import off3 from "./pics/offer.png";
import "./styles.scss";
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import logo from "./pics/elogo-removebg-preview.png";
import { FaSearch, FaTimes, FaSignOutAlt } from 'react-icons/fa';
const Home = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', imgsrc: '' });
  const [editingId, setEditingId] = useState(null);
  const {cart, addToCart}=useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  const handleLogout = () => {
    // Clear authentication tokens or session data
    localStorage.removeItem('authToken'); // Example: Remove auth token from localStorage
    navigate('/'); // Redirect to login page
  };
  const handleAddToCart = async (product) => {
    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        product_id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imgsrc: product.imgsrc,
      };

      await addToCart(productData);
      setNotification('Product added to cart successfully!');

      // Clear the notification after 3 seconds
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (error) {
      setError('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      console.log(response.data); 
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await axios.put(`http://localhost:5000/products/${editingId}`, form);
      } else {
        await axios.post('http://localhost:5000/products', form);
      }
      setForm({ name: '', description: '', price: '', imgsrc: '' });
      setEditingId(null);
      fetchProducts();
      setShowPopup(false);
      setNotification('Product added/updated successfully!');
      
      // Clear the notification after 3 seconds
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setNotification('Failed to add/update product.');
      
      // Clear the notification after 3 seconds
      setTimeout(() => {
        setNotification('');
      }, 3000);
    }
  };

  const handleEdit = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setForm({ name: product.name, description: product.description, price: product.price, imgsrc: product.imgsrc });
      setEditingId(id);
      setShowPopup(true); // Open the popup for editing
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/products/${id}`);
        fetchProducts();
        setNotification('Product deleted successfully!');
  
        // Clear the notification after 3 seconds
        setTimeout(() => {
          setNotification('');
        }, 3000);
      } catch (err) {
        console.error(err);
        setNotification('Failed to delete product.');
  
        // Clear the notification after 3 seconds
        setTimeout(() => {
          setNotification('');
        }, 3000);
      }
    }
  };
  
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const results = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(results);
  };
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(products); // Reset filtered products
  };
  
  return (
    <div className='sass'>
    <div>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <link rel="icon" href="images/logo.png" type="image/gif" sizes="16x16" />
      <link href="https://fonts.googleapis.com/css2?family=Abel&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" />
      <link rel="stylesheet" href="style.css" />
      <title>HOT GADGETS</title>
      <main className="container">
        <header>
        <Navbar expand="lg" className="fill">
        <Navbar.Brand href="#">
        <img
          src={logo}
          alt="Your Brand"
          style={{ width: '120px', height: 'auto', }} 
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
        <Form inline className="ml-auto" onSubmit={handleSearchSubmit}>
  <div className="input-group">
    <Form.Control
      type="text"
      placeholder="Search products"
      value={searchQuery}
      onChange={handleSearch}
      className="form-control"
    />
    <div className="input-group-append">
      {searchQuery && (
        <Button variant="link" onClick={clearSearch} className="search-icon">
          <FaTimes />
        </Button>
      )}
      <Button variant="outline-success" type="submit">
        <FaSearch />
      </Button>
    </div>
  </div>
</Form>


          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#" onClick={() => setShowPopup(true)}>Product</Nav.Link>
          <Nav.Link href="#">About Us</Nav.Link>
          <Nav.Link href="#">Contact Us</Nav.Link>
          <Nav.Link as={Link} to="/cart">Cart ({cart.length})</Nav.Link>
          <Nav.Link as={Link} to="/order-history">Order History</Nav.Link>
           <Nav.Link onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
        </header><br></br>
       {/* Offer Slideshow */}
       <section id="offers">
       <Carousel interval={1800}>
              <Carousel.Item>
                <img className="d-block w-100" src={off1} alt="First offer" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={off2} alt="Second offer" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={off3} alt="Third offer" />
              </Carousel.Item>
            </Carousel>
          </section>
          <section id="products">
  <h2>Products</h2>
  <div className="row">
  {filteredProducts.map(product => (
      <div key={product.id} className="col-md-4 mb-4">
        <div className="card text-center" style={{ border: 'none' }}>
          <img src={product.imgsrc} className="card-img-top" alt={product.name} />
          <div className="card-body">
            <h5 className="card-title"><b>{product.name}</b></h5>
            <p className="card-text">{product.description}</p>
            <h5>₹ {product.price}</h5>
            <button
                        type="button"
                        className="btn btn-custom btn-success"
                        onClick={() => handleAddToCart(product)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding...' : 'Add to Cart'}
                      </button>
            <button type="button" class="btn btn-custom btn-warning" onClick={() => handleEdit(product.id)}>
    <i class="fas fa-edit fa-sm"></i> Edit
</button>
            <button type="button" class="btn btn-custom btn-danger" onClick={() => handleDelete(product.id)}>
            <i class="fas fa-times-circle fa-sm"></i> Delete</button>
           </div>
        </div>
      </div>
    ))}
  
  </div>
</section>
{notification && (
  <div className="notification">
    {notification}
  </div>
)}

        <section id="mack-book">
      <Carousel prevIcon={<CustomPrevIcon />} nextIcon={<CustomNextIcon />}>
        <Carousel.Item>
          <Row>
            <Col md={6} className="mack">
              <h1>MackBook Pro</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et illum in iste rerum perferendis suscipit ipsa commodi, dolores laborum iusto sequi, incidunt voluptas eos est molestiae temporibus minima corporis voluptatibus!</p>
              <a className="mack-btn">Buy Now</a>
            </Col>
            <Col md={6}>
              <img className="d-block w-100" src={img1} alt="First slide" />
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row>
            <Col md={6} className="mack">
              <h1>Alexa Echo Dot</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et illum in iste rerum perferendis suscipit ipsa commodi, dolores laborum iusto sequi, incidunt voluptas eos est molestiae temporibus minima corporis voluptatibus!</p>
              <a className="mack-btn">Buy Now</a>
            </Col>
            <Col md={6}>
              <img className="d-block w-100" src={img2} alt="Second slide" />
            </Col>
          </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row>
            <Col md={6} className="mack">
              <h1>JBL Max</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et illum in iste rerum perferendis suscipit ipsa commodi, dolores laborum iusto sequi, incidunt voluptas eos est molestiae temporibus minima corporis voluptatibus!</p>
              <a className="mack-btn">Buy Now</a>
            </Col>
            <Col md={6}>
              <img className="d-block w-100" src={img3} alt="Third slide" />
            </Col>
          </Row>
        </Carousel.Item>
      </Carousel>
    </section>
    <Modal show={showPopup} onHide={() => setShowPopup(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? "Edit Product" : "Add Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" id="description" name="description" value={form.description} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="text" className="form-control" id="price" name="price" value={form.price} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="imgsrc">Image URL</label>
                <input type="text" className="form-control" id="imgsrc" name="imgsrc" value={form.imgsrc} onChange={handleFormChange} required />
              </div>
              <button type="submit" className="btn btn-primary">{editingId ? "Update Product" : "Add Product"}</button>
            </form>
          </Modal.Body>
        </Modal>
      </main>
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
    </div>
  );
};

export default Home;
