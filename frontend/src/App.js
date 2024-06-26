import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes

import Header from "./Header";
import Footer from "./Footer";
import Landing from "./Landing";
import Home from "./Landing";
import Investors from "./Investors";
import Marketplace from "./Marketplace";
import Login from "./Login";
import Signup from "./Signup";
import ContactUs from "./ContactUs";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import PropertyListing from "./Property-Listing";
import PropertyVerification from "./propertyverification";
import KycVerification from "./kycverification";
import KycRequest from "./kycrequest";
import VerifiedStatus from "./VerifiedStatus";
import Balance from "./Balance";
import Rent from "./Rent";
import Buy from "./BuyToken"
import ConnectionContextProvider from "./context/ConnectionContextProvider";

function App() {
  return (
    <ConnectionContextProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            {/* Wrap your routes in a <Routes> component */}
            <Route path="/" element={<Landing />} />
            <Route path="/Landing" element={<Home />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/UserDashboard" element={<UserDashboard />} />
            <Route path="/Property-Listing" element={<PropertyListing />} />
            <Route
              path="/propertyverification"
              element={<PropertyVerification />}
            />
             <Route
              path="/kycverification"
              element={<KycVerification />}
            />
              <Route
              path="/kycrequest"
              element={<KycRequest />}
            />
            <Route path="/VerifiedStatus" element={<VerifiedStatus />} />
            <Route path="/Balance" element={<Balance />} />
            <Route path="/Rent" element={<Rent />} />
            <Route path="/Buy" element={<Buy/>}/>
          </Routes>
        </div>
        <Footer />
      </Router>
    </ConnectionContextProvider>
  );
}

export default App;
