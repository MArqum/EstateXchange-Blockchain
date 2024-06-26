const propertyBalanceModel = require("../models/propertyBalance");
const mongoose = require("mongoose");
const mongooseId = mongoose.Types.ObjectId();
const handleResponse = require("../utils/constraints/responseHandler");

const propertyRentCreated = async (req, res) => {
  try {
    // add user id while creating property
    // req.body.user = req.user._id;
    // if (req.body.user) {
    req.body.user = new mongoose.Types.ObjectId(req.body.user);
    let query = {
      user: req?.body?.user,
      tokenId: req?.body?.tokenId,
    };
    const AlreadyExist = await propertyBalanceModel.findOne(query);
    let data;
    if (AlreadyExist) {
      const rent = Number(AlreadyExist.rentToken) + Number(req.body.rentToken);
      await propertyBalanceModel.updateOne(query, {
        rentToken: rent,
      });
      data = await propertyBalanceModel.findOne(query);
    } else {
      data = await propertyBalanceModel.create(req.body);
    }
    return handleResponse.createdResponse(res, data, "Created Successfully!");
    // } else {
    //     return handleResponse.notFoundResponse(res, "User not found!");
    // }
  } catch (err) {
    console.log("Error = ", err);
    handleResponse.errorResponse(res, "Internal Server Error Occured!");
  }
};

const getPropertyRentList = async (req, res) => {
  try {
    let query = {};
    // Check if the user is an admin
    if (req.user.role === "admin") {
      // Admin user, fetch all properties
      query = {};
    } else {
      // Regular user, fetch properties created by the user
      query = { user: req.user._id };
    }

    const data = await propertyBalanceModel
      .find(query)
      .populate({
        path: "user",
        model: "User",
        select: "firstname lastname email address city",
      })
      .sort({ createdAt: -1 });

    const propertyCount = await propertyBalanceModel.countDocuments(query);

    return handleResponse.successResponse(
      res,
      {
        propertyRentList: data,
        propertyCount: propertyCount,
      },
      "Property rent List View Successfully!"
    );
  } catch (error) {
    console.log("Error = ", error);
    handleResponse.errorResponse(res, "Internal Server Error Occurred!");
  }
};

module.exports = {
  propertyRentCreated,
  getPropertyRentList,
};
