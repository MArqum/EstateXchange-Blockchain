// Import your CSS file
import './AdminDashboard.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faCheck, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPropertyData();
  }, []);

  const fetchPropertyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/v1/property/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response:', response);

      if (Array.isArray(response.data.data.propertyList)) {
        setPropertyData(response.data.data.propertyList);
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handlePropertyVerification = () => {
    navigate('/propertyverification');
  };



  const handleKYCRequests = () => {
    navigate('/kycrequest');
    // Implement logic for handling KYC requests
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-options-icon" onClick={handleToggleOptions}>
          <FontAwesomeIcon icon={faUser} />
        </div>
        {showOptions && (
          <div className="admin-buttons">
            <button onClick={handlePropertyVerification} className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Property Verification
            </button>
            <button onClick={handleKYCRequests}>
              <FontAwesomeIcon icon={faUser} /> KYC Requests
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </div>
        )}
      </div>
      <div className="dashboard-main w-[1100px] mx-auto">
        <section className="admin2-section">
          <h2>Properties</h2>
          <div className="property-listings grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyData.map(property => (
              <div className="property-item bg-white shadow-md rounded p-4" key={property.id}>
                <img src={property.imageUrl} alt={`Property ${property.id}`} className="w-full h-48 object-cover rounded-md" />
                <h3 className="text-xl font-semibold mt-2">{property.propertyName}</h3>
                <p className="text-gray-600">Location: {property.propertyLocation}</p>
                <p className="text-gray-800 font-bold">Price: ${property.propertyPrice}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
