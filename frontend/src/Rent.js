// RentalProperty.js
import React, { useEffect, useState, useContext } from "react";
import ConnectionContext from "./context/ConnectionContext";
import axios from "axios";
import WalletConnect from "./WalletConnect";
import { Contract, parseUnits } from "ethers";
import Swal from "sweetalert2";
import config from "./config/index.json";

const Rent = () => {
  const [rentPaid, setRentPaid] = useState(false);
  const { userInfo, signer, isConnected } = useContext(ConnectionContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const fetchPropertyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/v1/property/rent/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data.data.rentList);
      setProperties(response.data.data.rentList);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching property data:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, []); // Empty dependency array to ensure the effect runs only once after the initial render

  const updateRentStatus = async (record, token) => {
    try {

      const rentDate = new Date(record.rentDate).toLocaleDateString(); // Assuming "5/11/2024" means May 11, 2024
      const recordDate = new Date(rentDate);
      const newDate = new Date(recordDate.setMonth(recordDate.getMonth() + 1)).toLocaleDateString();
      let query = {
        tokenId: record.tokenId,
        rentDate: newDate
      }
      console.log("query:", query);
      await axios.patch(
        "http://localhost:4000/api/v1/property/pay/rent",
        query,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: `Next rent date updated successfully`,
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Fail to update rent date!",
        icon: "error",
        confirmButtonText: "Okay",
      });

    }
  }
  const handleRentPayment = async (propertyId) => {
    if (!isConnected) {
      Swal.fire({
        title: "Error!",
        text: "Wallet is not connected",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
    const record = properties.find((item) => item._id === propertyId);
    // const date = new Date(record.rentDate).toLocaleDateString()
    console.log(record)
    const details = record?.rentDetails
    const token = localStorage.getItem("token");

    if (!details.length) {

      Swal.fire({
        title: "Success!",
        text: `No one to pay`,
        icon: "success",
        confirmButtonText: "Okay",
      });

      await updateRentStatus(record, token)
      fetchPropertyData();
      return
    }
    let userAddress = []
    let rents = []
    let total = 0
    console.log(details, "details")
    await details.map((property) => {
      userAddress.push(property.walletAddress)
      total = total + (Number(property.rentalPerToken) * Number(property.tokenQuantity))
      let rent = (Number(property.rentalPerToken) * Number(property.tokenQuantity)).toString()
      rent = parseUnits(rent, 18).toString()
      rents.push(rent)
    })
    console.log(userAddress, "userAddress")
    console.log(rents, "rents")
    total = parseUnits(total.toString(), 18).toString()

    // return
    try {

      const Erc20Contract = new Contract(
        config.erc20Address,
        config.erc20Abi,
        signer
      );
      const approve = await Erc20Contract.approve(
        config.marketPlaceAddress,
        total
      );
      await approve.wait();
      if (approve?.hash) {
        const rentContract = new Contract(config.marketPlaceAddress, config.marketPlaceAbi, signer)
        const payRent = await rentContract.payRent(config.erc20Address, userAddress, rents)
        await payRent.wait()
        Swal.fire({
          title: "Success!",
          text: `Rent pay successfully, txHash: ${payRent.hash}`,
          icon: "success",
          confirmButtonText: "Okay",
        });

        try {

          for (const property of details) {

            let query = {
              propertyName: record.propertyName,
              propertyPrice: record.propertyPrice,
              tokenId: record.tokenId,
              rentToken: Number(property.rentalPerToken) * Number(property.tokenQuantity),
              walletAddress: property.walletAddress,
              user: property.user
            }
            console.log("query:", query);
            await axios.post(
              "http://localhost:4000/api/v1/balance/rent/created",
              query,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }

          Swal.fire({
            title: "Success!",
            text: `Rent balance update succes`,
            icon: "success",
            confirmButtonText: "Okay",
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Error!",
            text: "Fail to update rent balances!",
            icon: "error",
            confirmButtonText: "Okay",
          });
        }

        await updateRentStatus(record, token)
        fetchPropertyData();
      }

    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Fail to pay the rent!",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <>
      <WalletConnect />
      <div className="marketplace-container">
        <h2>Available Rental Properties</h2>
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
                  <p>Property Type: {listing.propertyType}</p>
                  <p>Total Quantity: x{listing.tokenQuantity}</p>
                  <p>
                    Rent per Token: {listing.tokenPrice / listing.tokenQuantity}{" "}
                    $
                  </p>
                  <p>
                    Next Rent Date: {new Date(listing.rentDate).toLocaleDateString()}
                  </p>
                  {new Date(new Date(listing.rentDate).toLocaleDateString()) < new Date() && (
                    <button onClick={() => handleRentPayment(listing._id)}>
                      Pay Rent
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Rent;
