// src/components/Header.jsx
import React from 'react';

export default function Header() {
  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="container">
          <a className="navbar-brand" href="#home">0-Robinson-1</a>
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#gallery">Gallery</a></li>
            <li className="nav-item"><a className="nav-link" href="#videos">Videos</a></li>
            <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}