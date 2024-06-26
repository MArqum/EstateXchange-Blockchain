import React, { useState, useEffect } from 'react';
import axios from './axios'; // Import the configured Axios instance
import './Propertylisting.css';
import './propertyverification.css';
import './KycRequest.css'; // Import the new CSS file

const KycRequest = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [viewApproved, setViewApproved] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchKycRequests = async () => {
      try {
        const response = await axios.get('/admin/getKycList');
        console.log('API response:', response.data); // Log the response
        setKycRequests(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching KYC requests:', error);
        setError('Failed to fetch KYC requests. Please try again later.');
      }
    };

    fetchKycRequests();
  }, []);

 

  const closePopup = () => {
    setShowPopup(false);
  };

  const requestsToDisplay = viewApproved ? approvedRequests : kycRequests;



  return (
    <div>
      <section className="admin2-section">
        <h2>KYC Requests</h2>
        
        <div className="kyc-listings">
          {error && <p className="error-message">{error}</p>}
          {requestsToDisplay.length > 0 ? (
            requestsToDisplay.map((request) => (
              <div key={request._id} className="kyc-card">
                <p><strong>ID:</strong> {request._id}</p>
                <p><strong>Front ID Card:</strong> <a href={request.frontIdCard} target="_blank" rel="noopener noreferrer">View</a></p>
                <p><strong>Back ID Card:</strong> <a href={request.backIdCard} target="_blank" rel="noopener noreferrer">View</a></p>
                <p><strong>Property Documents:</strong></p>
                <ul>
                  {request.propertyDocuments.map((doc, index) => (
                    <li key={index}><a href={doc} target="_blank" rel="noopener noreferrer">Document {index + 1}</a></li>
                  ))}
                </ul>
                <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
             
              </div>
            ))
          ) : (
            <p>{viewApproved ? 'No approved requests found.' : 'No KYC requests found.'}</p>
          )}
        </div>
      </section>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p className="popup-message">Failed to approve KYC request. Please try again later.</p>
            <button onClick={closePopup} className="close-popup-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycRequest;
