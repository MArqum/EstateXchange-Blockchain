// Investors.js
import React from 'react';
import './Investors.css';

const Investors = () => {
  const investors = [
    { id: 1, name: 'Investor 1', description: 'Ittefaq Residencia' },
    { id: 2, name: 'Investor 2', description: 'Shaheen Town' },
    { id: 3, name: 'Investor 3', description: 'Bahria Enclave' },
    { id: 4, name: 'Investor 4', description: 'Bahria phase 1' },
  ];

  return (
    <div className="investors-container">
      <h2>Our Investors</h2>
      <div className="investors-list">
        {investors.map((investor) => (
          <div key={investor.id} className="investor-card">
            <h3>{investor.name}</h3>
            <p>{investor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investors;
