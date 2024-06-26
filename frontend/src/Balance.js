import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Balance.css'; // Import the CSS file

const Balance = () => {
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/v1/balance/rent/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data.data.propertyRentList);
      setRent(response.data.data.propertyRentList);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching property data:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, []); // Empty dependency array to ensure the effect runs only once after the initial render

  return (
    <div>
      <section className="admin2-section">
        <h2>Balance Property</h2>
        <div className="property-listings">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="property-container">
              {rent.map(property => (
                <div className="property-item" key={property._id}>
                  <h3>{property.propertyName}</h3>
                  <p>Property Price: ${property.propertyPrice}</p>
                  <p>Property Rent Received: ${property.rentToken}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Balance;
