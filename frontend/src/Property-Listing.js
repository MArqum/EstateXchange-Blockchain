import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Propertylisting.css";
import axios from "./axios.js";
import WalletConnect from "./WalletConnect.js";
import ConnectionContext from "./context/ConnectionContext";
import Swal from "sweetalert2";
import { Contract, parseUnits, formatUnits } from "ethers";
import config from "./config/index.json";

const PropertyListingPage = () => {
  const { userInfo, signer, isConnected } = useContext(ConnectionContext);
  const [action, setAction] = useState("");
  const navigate = useNavigate();

  const handleAction = (selectedAction) => {
    setAction(selectedAction);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [propertyDetails, setPropertyDetails] = useState({
    propertyName: "",
    propertyLocation: "",
    propertyPrice: "",
    propertyDescription: "",
    imageUrl: [],
    generateTokens: false,
    tokenPrice: "",
    tokenQuantity: "",
    propertyType: "",
    rentalPrice: "",
    rentDate: "",
  });

  const [submissionMessage, setSubmissionMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    // If the property type is nonRental, we want to reset the rentalPrice field
    const updatedDetails =
      name === "propertyType" && value === "nonRental"
        ? { ...propertyDetails, rentalPrice: "", rentDate: "" }
        : { ...propertyDetails };

    // const updatedDetails =
    //   name === "propertyType" && value === "nonRental"
    //     ? { ...propertyDetails, rentalPrice: "" }
    //     : { ...propertyDetails };

    setPropertyDetails((prevDetails) => ({
      ...updatedDetails,
      [name]: inputValue,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    const imageFiles = Array.from(files);

    // Convert each image to base64
    const promises = imageFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result); // Use reader.result to get the base64 string
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    // Wait for all promises to resolve
    Promise.all(promises)
      .then((base64Images) => {
        // Update state with base64 images
        setPropertyDetails((prevDetails) => ({
          ...prevDetails,
          imageUrl: [...prevDetails.imageUrl, ...base64Images],
        }));
      })
      .catch((error) => {
        console.error("Error converting images to base64:", error);
      });
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      Swal.fire({
        title: "Error!",
        text: "Wallet is not connected",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
    // Convert imageUrl array to a single string
    const imageUrlString = propertyDetails.imageUrl.join(",");

    // Update propertyDetails with the string value
    const updatedPropertyDetails = {
      ...propertyDetails,
      imageUrl: imageUrlString,
      rentDate: propertyDetails.propertyType === "rental" ? propertyDetails.rentDate : null,
    };

    // Validation checks
    const errors = {};
    if (!updatedPropertyDetails.propertyName) {
      errors.propertyName = "Property name is required";
    }
    if (!updatedPropertyDetails.propertyLocation) {
      errors.propertyLocation = "Property location is required";
    }
    if (!updatedPropertyDetails.propertyPrice) {
      errors.propertyPrice = "Property price is required";
    }
    if (updatedPropertyDetails.generateTokens) {
      if (!updatedPropertyDetails.tokenPrice) {
        errors.tokenPrice = "Token price is required";
      }
      if (!updatedPropertyDetails.tokenQuantity) {
        errors.tokenQuantity = "Token quantity is required";
      }
      let price = parseUnits(
        updatedPropertyDetails.tokenPrice.toString(),
        18
      ).toString();
      console.log("price", price);
      // updatedPropertyDetails.tokenPrice = price;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    console.log(updatedPropertyDetails)

    if (updatedPropertyDetails.propertyType === "rental" && !updatedPropertyDetails.rentalPrice && !updatedPropertyDetails.rentDate) {
      Swal.fire({
        title: "Error!",
        text: "Rent and rented date is requird for rented property",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }


    // Remove rentalPrice from updatedPropertyDetails if nonRentalProperty is selected
    let type = 1;
    let rent = updatedPropertyDetails?.rentalPrice ? parseUnits(
      updatedPropertyDetails?.rentalPrice?.toString(),
      18
    ).toString() : 0;
    console.log("rent", rent)
    if (!updatedPropertyDetails.propertyType){
      Swal.fire({
        title: "Error!",
        text: "property type is not selected",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
    if (updatedPropertyDetails.propertyType === "nonRental") {
      delete updatedPropertyDetails.rentalPrice;
      delete updatedPropertyDetails.rentDate;

      type = 0;
      rent = 0;
    }

    try {
      console.log("herrre");
      // const response = await axios.get(
      //   "http://localhost:4000/api/v1/property/uniqueProertyId"
      // );
      // console.log("response", response?.data?.data);
      // const propertyTokenId = Number(response?.data?.data);
      const mintContract = new Contract(
        config.erc1155Address,
        config.erc1155Abi,
        signer
      );
      let tokenId = Number(await mintContract.totalTokens());
      tokenId = tokenId + 1;
      console.log(type, rent);
      const createProperty = await mintContract.createProperty(
        userInfo.account,
        tokenId,
        Number(updatedPropertyDetails.tokenQuantity),
        type,
        rent
      );
      await createProperty.wait();
      console.log("transaction Hash", createProperty.hash);
      Swal.fire({
        title: "Success!",
        text: `Token Created Success, txHash: ${createProperty.hash}`,
        icon: "success",
        confirmButtonText: "Okay",
      });
      updatedPropertyDetails.tokenId = tokenId;
      updatedPropertyDetails.walletAddress = userInfo.account
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Token Created Fail",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }

    try {
      // Make POST request to API
      console.log("updatedPropertyDetails:", updatedPropertyDetails);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/v1/property/created",
        updatedPropertyDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form after successful submission
      setPropertyDetails({
        propertyName: "",
        propertyLocation: "",
        propertyPrice: "",
        propertyDescription: "",
        imageUrl: [],
        tokenPrice: "",
        tokenQuantity: "",
        propertyType: "",
        rentalPrice: "",
        rentDate:""
      });

      // Reset validation errors
      setValidationErrors({});

      // Display submission message
      setSubmissionMessage(
        "Property submitted for verification. Thank you for your patience!"
      );
    } catch (error) {
      // Handle error
      console.log(error.response.data);
      console.error("Error submitting property:", error);
      // Display submission message
      setSubmissionMessage(
        "Error submitting property. Please try again later."
      );
    }
  };

  return (
    <div className="property-listing">
      <div className="property-left-column">
        <div className="action-buttons">
          <Link to="/Buy">
          <button onClick={() => handleAction("buy")}>Buy Tokens</button>
          </Link>
          <button onClick={() => handleAction("sell")}>Sell Tokens</button>
          <Link to="/property-listing">
            <button onClick={() => handleAction("list")}>List Property</button>
          </Link>

          <Link to="/VerifiedStatus">
            <button onClick={() => handleAction("verified")}>
              Property Status
            </button>
          </Link>
          <Link to="/Balance">
            <button onClick={() => handleAction("balance")}>Balance</button>
          </Link>
          <Link to="/Rent">
            <button onClick={() => handleAction("rent")}>Rent</button>
          </Link>
          <button>Settings</button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="property-listing-page">
        <div className="listing-header">
          <h2>Property Listing</h2>
          <p>
            List your property to reach a global audience and maximize your
            opportunities.
          </p>
        </div>

        <form>
          <label>
            Property Name:
            <input
              type="text"
              name="propertyName"
              value={propertyDetails.propertyName}
              onChange={handleInputChange}
              placeholder="Enter property name"
            />
            {validationErrors.propertyName && (
              <span className="error-message">
                {validationErrors.propertyName}
              </span>
            )}
          </label>

          <label>
            Property Location:
            <input
              type="text"
              name="propertyLocation"
              value={propertyDetails.propertyLocation}
              onChange={handleInputChange}
              placeholder="Enter property location"
            />
            {validationErrors.propertyLocation && (
              <span className="error-message">
                {validationErrors.propertyLocation}
              </span>
            )}
          </label>

          <label>
            Property Price:
            <input
              type="text"
              name="propertyPrice"
              value={propertyDetails.propertyPrice}
              onChange={handleInputChange}
              placeholder="Enter property price"
            />
            {validationErrors.propertyPrice && (
              <span className="error-message">
                {validationErrors.propertyPrice}
              </span>
            )}
          </label>

          <label>
            Property Description:
            <textarea
              name="propertyDescription"
              value={propertyDetails.propertyDescription}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the property"
            />
          </label>

          <label>
            Generate Tokens:
            <input
              type="checkbox"
              name="generateTokens"
              checked={propertyDetails.generateTokens}
              onChange={handleInputChange}
            />
          </label>

          {propertyDetails.generateTokens && (
            <div>
              <label>
                Token Price:
                <input
                  type="text"
                  name="tokenPrice"
                  value={propertyDetails.tokenPrice}
                  onChange={handleInputChange}
                  placeholder="Enter token price"
                />
              </label>

              <label>
                Token Quantity:
                <input
                  type="text"
                  name="tokenQuantity"
                  value={propertyDetails.tokenQuantity}
                  onChange={handleInputChange}
                  placeholder="Enter token quantity"
                />
              </label>
            </div>
          )}

          <label>
            Property Type:
            <select
              name="propertyType"
              value={propertyDetails.propertyType}
              onChange={handleInputChange}
            >
              <option value="">Select Property Type</option>
              <option value="rental">Rental Property</option>
              <option value="nonRental">Non-Rental Property</option>
            </select>
          </label>

          {propertyDetails.propertyType === "rental" && (
            <label>
              Rental Price:
              <input
                type="text"
                name="rentalPrice"
                value={propertyDetails.rentalPrice}
                onChange={handleInputChange}
                placeholder="Enter rental price"
              />
            </label>
          )}
          {propertyDetails.propertyType === "rental" && (
            <label>
              Select Next Payed Rental Date:
              <input
                type="date"
                name="rentDate"
                value={propertyDetails.rentDate}
                onChange={handleInputChange}
              />
            </label>
          )}

          <label>
            Upload Photos:
            <input type="file" multiple onChange={handlePhotoUpload} />
          </label>

          <button type="button" onClick={handleSubmit}>
            Submit Request
          </button>

          {submissionMessage && (
            <div className="submission-message">
              <p>{submissionMessage}</p>
            </div>
          )}
        </form>
      </div>
      <WalletConnect />
    </div>
  );
};

export default PropertyListingPage;
