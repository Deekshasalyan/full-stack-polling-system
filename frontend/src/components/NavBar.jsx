// src/components/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();

  const getLinkClassName = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        📊 Polling System
      </div>
      <div className="navbar-links">
        <Link to="/poll" className={getLinkClassName('/poll')}>
          Cast Vote (Screen 1)
        </Link>
        <Link to="/dashboard" className={getLinkClassName('/dashboard')}>
          Trend Analysis (Screen 2)
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;