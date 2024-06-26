// UserDashboard.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // Import your CSS file

const UserDashboard = () => {
  const [action, setAction] = useState('');
  const navigate =  useNavigate()
  const handleAction = (selectedAction) => {
    setAction(selectedAction);
  };
  const handleLogout=()=>{
    localStorage.clear()
    navigate('/login')
    
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-left-column">
        <div className="action-buttons">
          <Link to="/Buy">
          <button onClick={() => handleAction('buy')}>Buy Tokens</button>
          </Link>

          <Link to="/kycverification">
            <button onClick={() => handleAction('verify')}>KYC Verification</button>
          </Link>
          
          <Link to="/property-listing">
            <button onClick={() => handleAction('list')}>List Property</button>
          </Link>
          
          
          <Link to="/VerifiedStatus">
            <button onClick={() => handleAction('verified')}>Property Status</button>
          </Link>
          <Link to = "/Balance">
          <button onClick={() => handleAction('balance')}>Balance</button>
          </Link>
          <Link to = "/Rent">
          <button onClick={() => handleAction('rent')}>Rent</button>
          </Link>
       
          <button type='button' onClick={ handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-main">
        {action && (
          <div className="selected-action">
            {action === 'buy' && <p>Choose properties to buy tokens.</p>}
            {action === 'sell' && <p>Sell your tokens to interested buyers.</p>}
            {action === 'list' && <p>List your property to generate tokens.</p>}
            {action === 'verify' && <p>List your property to generate tokens.</p>}
            {action === 'verified' && <p>verified your property.</p>}
            {action === 'balance' && <p>Token Balance.</p>}
            {action === 'rent' && <p>Rental Property.</p>}
            
            
          </div>
        )}

<div className="why-choose-us">
  <h2>Why Choose Us?</h2>
  <p>
    Welcome to EstateXChange Blockchain, where innovation meets real estate! Our platform offers a cutting-edge and secure environment for property transactions using blockchain technology. Here's why you should choose us for your real estate needs:
  </p>

  <ul>
    <li>
      <strong>Blockchain Security:</strong> We leverage the power of blockchain to ensure the utmost security for your property transactions. Every step is transparent, traceable, and tamper-proof, providing you with peace of mind.
    </li>

    <li>
      <strong>Global Reach:</strong> List your properties on a global stage. EstateXChange Blockchain connects buyers and sellers from around the world, expanding your reach and maximizing your opportunities.
    </li>

    <li>
      <strong>Tokenization:</strong> Unlock new possibilities with property tokenization. Generate tokens for your listings, allowing for fractional ownership, increased liquidity, and a broader range of investors.
    </li>

    <li>
      <strong>User-Friendly Interface:</strong> Our user-friendly dashboard makes it easy to buy, sell, and list properties. Navigate through your real estate transactions seamlessly, with all the tools you need at your fingertips.
    </li>

    <li>
      <strong>Trust and Transparency:</strong> Trust is the foundation of any successful real estate transaction. We prioritize transparency in every step, ensuring both buyers and sellers have access to reliable information.
    </li>
  </ul>

  <p>
    Join EstateXChange Blockchain today and experience the future of real estate. Empower your property transactions with the latest blockchain technology, unmatched security, and a global community of real estate enthusiasts.
  </p>
</div>

      </div>
    </div>
    );
};

export default UserDashboard;