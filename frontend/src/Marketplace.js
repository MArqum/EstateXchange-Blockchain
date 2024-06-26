// Marketplace.js
import React, { useEffect, useState, useContext } from "react";
import "./Marketplace.css";
import axios from "axios";
import WalletConnect from "./WalletConnect";
import { Contract, parseUnits, formatUnits } from "ethers";
import Swal from "sweetalert2";
import config from "./config/index.json";
import ConnectionContext from "./context/ConnectionContext";

const Marketplace = () => {
  const { userInfo, signer, isConnected } = useContext(ConnectionContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const fetchPropertyData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/property/marketplace/list"
      );

      console.log("API Response:", response.data.data.propertyList);
      const initialQuantities = {};
      response.data.data.propertyList.forEach(listing => {
        initialQuantities[listing._id] = 1;
      });
      setQuantities(initialQuantities);
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

  const handleQuantityChange = (value, propertyId, maxQuantity) => {
    const newQuantity = Math.max(1, Math.min(value, maxQuantity));
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [propertyId]: newQuantity
    }));
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
        value[0].toLowerCase() === record.walletAddress.toLowerCase() &&
        Number(value[1]) === record.tokenId &&
        Number(value[2]) === record.remainingQuantity
      ) {
        indexed = index;
        return;
      }
    });
    return arr[indexed];
  };

  const purchaseFromMarketplace = async (propertyId) => {
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
    const userDetails = localStorage.getItem("userDetails")
    console.log(userDetails)

    console.log("Quantity", quantities[propertyId]);

    // return;
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
      if (!sellId) {
        Swal.fire({
          title: "Error!",
          text: "Sell id not found for a property",
          icon: "error",
          confirmButtonText: "Okay",
        });
        return;
      }

      const Erc20Contract = new Contract(
        config.erc20Address,
        config.erc20Abi,
        signer
      );
      const totalPrice = (Number(record.tokenPrice) * Number(quantities[propertyId]))
      console.log("total price", totalPrice)
      let price = parseUnits(totalPrice.toString(), 18).toString();
      console.log("price", price);
      const approve = await Erc20Contract.approve(
        config.marketPlaceAddress,
        price
      );
      await approve.wait();
      if (approve?.hash) {
        const purchase = await marketContract.buyPropertyToken(
          sellId,
          userInfo.account,
          Number(quantities[propertyId]),
          config.erc20Address
        );
        await purchase.wait();

        Swal.fire({
          title: "Success!",
          text: `purchase from marketplace successfully, txHash: ${purchase.hash}`,
          icon: "success",
          confirmButtonText: "Okay",
        });

        try {
          // Make POST request to API
          const token = localStorage.getItem("token");
          let querySend = {
            tokenId: record.tokenId,
            remainingQuantity: Number(record.remainingQuantity) - Number(quantities[propertyId]),
          };
          console.log("Status update query:", querySend);
          await axios.patch(
            "http://localhost:4000/api/v1/property/updatePropertyStatus",
            querySend,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          let imageUrl = Object.values(record.imageUrl)
          console.log(typeof (imageUrl), imageUrl)
          let query = {
            propertyName: record.propertyName,
            propertyLocation: record.propertyLocation,
            propertyPrice: record.propertyPrice,
            propertyDescription: record.propertyDescription,
            tokenId: record.tokenId,
            buyedPrice: totalPrice,
            tokenQuantity: Number(quantities[propertyId]),
            imageUrl,
            propertyType: record.propertyType,
            rentalPerToken: record.tokenPrice / record.tokenQuantity,
            walletAddress: userInfo.account
          };
          console.log("Buy token query:", query);
          await axios.post(
            "http://localhost:4000/api/v1/buyProperty/buyed/created",
            query,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Success!",
            text: `Property token buyed Successfully!`,
            icon: "success",
            confirmButtonText: "Okay",
          });
        } catch (error) {
          // Handle error
          console.log(error);
          Swal.fire({
            title: "Error!",
            text: "Fail to update the status!",
            icon: "error",
            confirmButtonText: "Okay",
          });
        }
        // setQuantities(prevQuantities => ({
        //   ...prevQuantities,
        //   [propertyId]: 1
        // }));
        fetchPropertyData();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "fail to purchase!",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
  };

  return (
    <>
      <WalletConnect />
      <div className="marketplace-container">
        <h2>EstateXChange Blockchain Marketplace</h2>
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
                  <p>Quantity: x{listing.remainingQuantity}</p>
                  <p>Token Price: {listing.tokenPrice} $</p>
                  <p>property Type: {listing.propertyType}</p>
                  {listing.propertyType === "rental" && (
                    <p>
                      Rent per Token: {listing.tokenPrice / listing.tokenQuantity} $
                    </p>
                  )}

                  {/* Quantity control */}
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(
                          quantities[listing._id] - 1,
                          listing._id,
                          listing.remainingQuantity
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      className="quantity-input"
                      type="number"
                      value={quantities[listing._id]}
                      onChange={(e) =>
                        handleQuantityChange(
                          parseInt(e.target.value),
                          listing._id,
                          listing.remainingQuantity
                        )
                      }
                    />
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(
                          quantities[listing._id] + 1,
                          listing._id,
                          listing.remainingQuantity
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => purchaseFromMarketplace(listing._id)}>
                    Buy Property Token
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Marketplace;
