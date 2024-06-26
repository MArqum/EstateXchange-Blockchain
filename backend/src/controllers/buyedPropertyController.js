const propertyModel = require("../models/buyedProperty");
const mongoose = require("mongoose");
const mongooseId = mongoose.Types.ObjectId();
const handleResponse = require("../utils/constraints/responseHandler");

const buyedPropertyMarketplace = async (req, res) => {
  try {
    // add user id while creating property
    req.body.user = req.user._id;
    if (req.body.user) {
      let query = { user: req?.body?.user, tokenId: req?.body?.tokenId };
      const AlreadyExist = await propertyModel.findOne(query);
      console.log("AlreadyExist", AlreadyExist)
      let data;
      if (AlreadyExist) {

        const quantity =
          Number(AlreadyExist.tokenQuantity) + Number(req.body.tokenQuantity);
        const price =
          Number(AlreadyExist.buyedPrice) + Number(req.body.buyedPrice);
        await propertyModel.updateOne(query, {
          tokenQuantity: quantity,
          buyedPrice: price,
        });
        data = await propertyModel.findOne(query);
      } else {
        data = await propertyModel.create(req.body);
      }
      return handleResponse.createdResponse(res, data, "Created Successfully!");
    } else {
      return handleResponse.notFoundResponse(res, "User not found!");
    }
  } catch (err) {
    console.log("Error = ", err);
    handleResponse.errorResponse(res, "Internal Server Error Occured!");
  }
};

const getBuyedPropertyList = async (req, res) => {
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

    const data = await propertyModel
      .find(query)
      .populate({
        path: "user",
        model: "User",
        select: "firstname lastname email address city",
      })
      .sort({ createdAt: -1 });

    const propertyCount = await propertyModel.countDocuments(query);

    return handleResponse.successResponse(
      res,
      {
        propertyList: data,
        propertyCount: propertyCount,
      },
      "Property List View Successfully!"
    );
  } catch (error) {
    console.log("Error = ", error);
    handleResponse.errorResponse(res, "Internal Server Error Occurred!");
  }
};

module.exports = {
  buyedPropertyMarketplace,
  getBuyedPropertyList
};
