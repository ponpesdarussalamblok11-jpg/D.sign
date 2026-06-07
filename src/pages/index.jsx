import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../styles/home.css';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from API
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1>D.sign Store</h1>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/admin/login">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to D.sign</h2>
          <p>Your premium e-commerce destination</p>
          <Link href="/products" className="cta-button">Shop Now</Link>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 D.sign. All rights reserved.</p>
      </footer>
    </div>
  );
}