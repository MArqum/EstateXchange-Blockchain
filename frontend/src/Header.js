import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#00172D',
  color: 'white',
  padding: '10px 20px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 10px',
  fontSize: '20px', // Font weight set to bold
};

const searchInputStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '0 10px', // Adjust margin for better spacing
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
};

const Header = () => {
  const location = useLocation();

  // Check if current path is Home, Login, or Signup
  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header style={headerStyle}>
   
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '35px' }}>EstateXchange</h1>
        </div>

        <nav style={navStyle}>
          <Link style={linkStyle} to="/">
            Home
          </Link>
          
            
              <Link style={linkStyle} to="/investors">
                Investors
              </Link>
              <Link style={linkStyle} to="/marketplace">
                Marketplace
              </Link>
              <Link style={linkStyle} to="/contactus">
                Contact Us
              </Link>
          
          
          {isAuthPage && (
            <>
              <Link style={linkStyle} to="/login">
                Login
              </Link>
              <Link style={linkStyle} to="/signup">
                Signup
              </Link>
            </>
          )}
        </nav>

        <div style={searchInputStyle}>
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <input type="text" placeholder="Search" />
            <div
              style={{
                width: '20px',
                cursor: 'pointer',
                paddingRight: '2px',
                objectFit: 'contain',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AiOutlineSearch color="black" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
