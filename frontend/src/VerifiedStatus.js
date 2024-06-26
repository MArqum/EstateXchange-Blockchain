import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import WalletConnect from "./WalletConnect";
import { Contract, parseUnits, formatUnits } from "ethers";
import Swal from "sweetalert2";
import config from "./config/index.json";
import ConnectionContext from "./context/ConnectionContext";

{
  /* <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
/>; */
}
const VerifiedStatus = () => {
  const { userInfo, signer, isConnected } = useContext(ConnectionContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/v1/property/list",
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

  // fetchPropertyData();

  const handleAddToMarketplace = async (propertyId) => {
    // Implement functionality to add property to marketplace
    if (!isConnected) {
      Swal.fire({
        title: "Error!",
        text: "Wallet is not connected",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
    try {
      console.log("Adding property to marketplace:", propertyId);
      const record = properties.find((item) => item._id === propertyId);
      console.log("record", record);

      const mintContract = new Contract(
        config.erc1155Address,
        config.erc1155Abi,
        signer
      );
      const approve = await mintContract.isApprovedForAll(
        userInfo.account,
        config.marketPlaceAddress
      );
      console.log("approve", approve);
      if (!approve) {
        const giveApprove = await mintContract.setApprovalForAll(
          config.marketPlaceAddress,
          true
        );
        await giveApprove.wait();
      }

      const marketContract = new Contract(
        config.marketPlaceAddress,
        config.marketPlaceAbi,
        signer
      );

      console.log(record.tokenPrice);
      let price = parseUnits(record.tokenPrice.toString(), 18).toString();
      console.log("Price:", price);
      console.log("Passing Data:", {
        tokenId: record.tokenId,
        account: userInfo.account,
        tokenQuantity: record.tokenQuantity,
        price,
      });
      const sell = await marketContract.sellProperty(
        record.tokenId,
        userInfo.account,
        record.tokenQuantity,
        price
      );
      await sell.wait();

      Swal.fire({
        title: "Success!",
        text: `Add to marketplace successfully, txHash: ${sell.hash}`,
        icon: "success",
        confirmButtonText: "Okay",
      });

      try {
        // Make POST request to API
        let query = {
          tokenId: record.tokenId,
          isAddedMarketplace: true,
        };
        console.log("updatedQuery:", query);
        const token = localStorage.getItem("token");
        await axios.patch(
          "http://localhost:4000/api/v1/property/updatePropertyStatus",
          query,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: `Status Updated Successfully!`,
          icon: "success",
          confirmButtonText: "Okay",
        });
      } catch (error) {
        // Handle error
        console.log(error.response.data);
        Swal.fire({
          title: "Error!",
          text: "Fail to update the status!",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }

      fetchPropertyData();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Add to marketplace fail",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
  };

  const sellingId = async (record, marketContract) => {
    const ids = await marketContract.getAllPropertySellingId();
    const arr = Object.keys(ids).map((key) => Number(ids[key]));
    const batchDetails = await marketContract.batchDetailsPropertySelling(arr);
    const batchDetailsarr = Object.keys(batchDetails).map((index) => {
      let details = batchDetails[index];
      const batchDetailsObj = Object.keys(details).reduce((acc, key) => {
        const value =
          typeof details[key] === "bigint"
            ? details[key].toString()
            : details[key];
        acc[key] = value;
        return acc;
      }, {});
      return batchDetailsObj;
    });
    let indexed = null;
    batchDetailsarr.find((value, index) => {
      if (
        value[0].toLowerCase() === userInfo.account.toLowerCase() &&
        Number(value[1]) === record.tokenId &&
        Number(value[2]) === record.remainingQuantity
      ) {
        indexed = index;
        return;
      }
    });
    return arr[indexed];
  };

  const removeFromMarketplace = async (propertyId) => {
    // Implement functionality to add property to marketplace
    if (!isConnected) {
      Swal.fire({
        title: "Error!",
        text: "Wallet is not connected",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
    try {
      const record = properties.find((item) => item._id === propertyId);

      const marketContract = new Contract(
        config.marketPlaceAddress,
        config.marketPlaceAbi,
        signer
      );
      console.log("Adding property to marketplace:", propertyId);
      const sellId = await sellingId(record, marketContract);
      console.log("sellId:", sellId);

      const cancel = await marketContract.removePropertySell(sellId);
      await cancel.wait();

      Swal.fire({
        title: "Success!",
        text: `Remove from marketplace successfully, txHash: ${cancel.hash}`,
        icon: "success",
        confirmButtonText: "Okay",
      });

      try {
        // Make POST request to API
        let query = {
          tokenId: record.tokenId,
          isAddedMarketplace: false,
        };
        console.log("updatedQuery:", query);
        const token = localStorage.getItem("token");
        await axios.patch(
          "http://localhost:4000/api/v1/property/updatePropertyStatus",
          query,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: `Status Updated Successfully!`,
          icon: "success",
          confirmButtonText: "Okay",
        });
      } catch (error) {
        // Handle error
        console.log(error.response.data);
        Swal.fire({
          title: "Error!",
          text: "Fail to update the status!",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
      fetchPropertyData();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Remove from marketplace fail!",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
  };

  return (
    <div>
      <WalletConnect />
      <section className="admin2-section">
        <h2>Property Status</h2>
        {loading ? (
          <p>Loading...</p>
        ) : properties.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <div className="property-listings">
            {/* Map over the properties array */}
            {properties.map((property) => (
              <div className="property-item" key={property._id}>
                <img src={property.imageUrl} alt={property.propertyName} />
                <h3>{property.propertyName}</h3>
                <p>Location: {property.propertyLocation}</p>
                <p>Total Token Quantity: x{property.tokenQuantity}</p>
                <p>Remaining Token Quantity: x{property.remainingQuantity}</p>
                <p>Token Price: ${property.tokenPrice}</p>
                <p>
                  Status: {property.isVerified ? "Verified" : "Not Verified"}
                </p>
                {property.isVerified && !property.isAddedMarketplace && (
                  <button onClick={() => handleAddToMarketplace(property._id)}>
                    Add To Marketplace
                  </button>
                )}
                {property.remainingQuantity > 0 &&
                  property.isAddedMarketplace && (
                    <button onClick={() => removeFromMarketplace(property._id)}>
                      Remove From Marketplace
                    </button>
                  )}
                {property.remainingQuantity === 0 &&
                  property.isAddedMarketplace && (
                    <h6 style={{ color: "blueviolet" }}>TOKEN SOLD</h6>
                  )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VerifiedStatus;
