import React from 'react';
import './index.css'; // Make sure to create this CSS file for styling
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>PureHarvest Organics</h1>
      </div>
      <nav className="nav-links">
        <Link to="/products" className="nav-link">
          Products
        </Link>
        <Link to="/cart" className="nav-link cart-link">
          Cart
        </Link>
      </nav>
    </header>
  );
};

export default Header;
