import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Propertylisting.css';
import './propertyverification.css';

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

const PropertyVerification = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [notApprovedProperties, setNotApprovedProperties] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('approved'); // Default tab is 'approved'

  useEffect(() => {
    // Fetch property data when component mounts
    fetchPropertyData();
  }, []);

  useEffect(() => {
    // Automatically close the popup after 2 seconds
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

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
        // Filter properties based on approval status
        const approved = response.data.data.propertyList.filter(property => property.approved);
        const notApproved = response.data.data.propertyList.filter(property => !property.approved);
        
        setApprovedProperties(approved); 
        setNotApprovedProperties(notApproved);
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  const approveProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/v1/property/approval/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      console.log('Property Approval Response:', response);
      
      // Show popup message if approval is successful
      if (response.status === 200) {
        setShowPopup(true);
        // Fetch updated property data
        fetchPropertyData();
      }
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  return (
    <div>
      <section className="admin2-section">
        <h2>Property Verification</h2>
        <div className="tabs">
  <button className="tab-button" onClick={() => setActiveTab('approved')}>Approved</button>
  <button className="tab-button" onClick={() => setActiveTab('notApproved')}>Not Approved</button>
</div>
        <div className="property-listings">
          {(activeTab === 'approved' ? approvedProperties : notApprovedProperties).map(property => (
            <div className="property-item" key={property.id}>
              {/* Set width and height attributes for smaller images */}
              <img src={property.imageUrl} alt={`Property ${property.id}`} width="190" height="148"  />
              <h3>{property.propertyName}</h3>
              <p>Location: {property.propertyLocation}</p>
              <p>Price: ${property.propertyPrice}</p>
              <button onClick={() => approveProperty(property._id)}>Approve</button>
            </div>
          ))}
        </div>
        {console.log('propertyData:', propertyData)}
      </section>
      {showPopup && (
        <div className="popup">
          <p>Property approved successfully!</p>
        </div>
      )}
    </div>
  );
};

export default PropertyVerification;
