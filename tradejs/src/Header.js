import React from 'react';
import { ReactComponent as Logo } from './logo.svg';
import './Header.css';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">
          <Logo className="d-inline-block align-text-top me-2 nav-logo-img" />
          Trade Route
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Empty list - No links */}
          </ul>
        </div>
      </div>
    </nav>
  );
}



export default Header;
