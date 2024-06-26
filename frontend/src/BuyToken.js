import React, {useEffect, useState} from 'react'
import axios from 'axios';

const BuyToken = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPropertyData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:4000/api/v1/buyProperty/buyed/list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("API Response:", response.data.data.propertyList);
            setProperties(response.data.data.propertyList);
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
      <>
          <div className="marketplace-container">
              <h2>Purchased Property Token From Marketplace</h2>
              <div className="listings">
                  {loading ? (
                      <p>Loading...</p>
                  ) : properties.length === 0 ? (
                      <p>No records found.</p>
                  ) : (
                      properties.map((listing) => (
                          <div key={listing._id} className="listing-card">
                              <div className="property-image">
                                  <img src={listing.imageUrl[0]} alt={listing.propertyName} />
                              </div>
                              <div className="property-details">
                                  <h3>{listing.propertyName}</h3>
                                  <p>{listing.propertyLocation}</p>
                                  <p>Purchased Quantity: x{listing.tokenQuantity}</p>
                                  <p>Purchase Token Price: {listing.buyedPrice} $</p>
                                  <p>Property Type: {listing.propertyType}</p>
                                  {listing.propertyType === "rental" && (
                                      <p>Total Property Rent: {listing.rentalPerToken * listing.tokenQuantity} $</p>
                                  )}
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </>
  )
}

export default BuyToken