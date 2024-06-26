const adminModel = require("../models/admin");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const mongooseId = mongoose.Types.ObjectId();
const handleResponse = require("../utils/constraints/responseHandler");
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const kycModel = require('../models/kyc');

const adminSignIn = async (req, res) => {
  try {
    // find admin
    let admin = await adminModel.findOne({ email: req.body.email });
    // find user
    let user = await userModel.findOne({ email: req.body.email });

    if (admin) {
      // compare passwords
      bcrypt.compare(req.body.password, admin.password, async (err, valid) => {
        if (err) {
          throw err; // handle error
        }
        if (valid) {
          // generate admin token with expiry of 1 year
          let token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
              data: {
                _id: admin._id,
                email: admin.email,
                role: admin.role,
              },
            },
            process.env.JWT_SECRET
          );

          let adminList = {
            _id: admin._id,
            email: admin.email,
            role: admin.role,
            token,
          };

          handleResponse.successResponse(
            res,
            adminList,
            "Admin logged in Successfully!"
          );
        } else {
          handleResponse.errorResponse(
            res,
            "Email and password are incorrect!"
          );
        }
      });
    } else if (user) {
      // compare passwords
      bcrypt.compare(req.body.password, user.password, async (err, valid) => {
        if (err) {
          throw err; // handle error
        }
        if (valid) {
          // generate user token with expiry of 1 year
          let token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
              data: {
                _id: user._id,
                email: user.email,
                role: user.role,
              },
            },
            process.env.JWT_SECRET
          );

          let userList = {
            _id: user._id,
            email: user.email,
            role: user.role,
            token: token,
          };

          handleResponse.successResponse(
            res,
            userList,
            "User logged in Successfully!"
          );
        } else {
          handleResponse.errorResponse(
            res,
            "Email and password are incorrect!"
          );
        }
      });
    } else {
      handleResponse.notFoundResponse(res, "No data found!");
    }
  } catch (err) {
    console.log("Error = ", err);
    handleResponse.errorResponse(res, "Internal Server Error Occurred!");
  }
};

// user register
const adminSignUp = async (req, res) => {
  try {
    // find email
    let users = await adminModel.findOne(
      { email: req.body.email },
      { email: 1 }
    );
    if (!users) {
      // encrypt user password
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
      let data = await adminModel.create(req.body);

      handleResponse.createdResponse(res, data, "Created Successfully!");
    } else {
      handleResponse.existResponse(res, "Email Already Exists!");
    }
  } catch (err) {
    console.log("Error = ", err);
    handleResponse.errorResponse(res, "Internal Server Error Occured!");
  }
};

cloudinary.config({
  cloud_name: "dzxyuhagh",
  api_key: "295679662214952",
  api_secret: "GBR2czyRHg46osxGfGEpOdf3zSk",
});
const multipleImageUpload = async (req, res) => {
  try {
    if (!req.files || !req.files.files) {
      return res.status(400).json({
        data: null,
        success: false,
        message: "Request invalid. Files are missing!",
      });
    }

    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const uploadPromises = files.map(async (file) => {
      const tmpFilePath = path.join(os.tmpdir(), file.name);

      // Write the file data to a temporary file
      await fs.writeFile(tmpFilePath, file.data);

      // Determine the resource type based on the file type
      const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';

      // Upload the temporary file to Cloudinary
      const result = await cloudinary.uploader.upload(tmpFilePath, {
        folder: "test", // Replace with your desired folder name
        resource_type: resourceType,
      });

      // Delete the temporary file after uploading
      await fs.unlink(tmpFilePath);

      return result.secure_url;
    });

    const uploadResults = await Promise.all(uploadPromises);

    if (uploadResults.length > 0) {
      return handleResponse.successResponse(
        res,
        { Locations: uploadResults },
        "Upload Successfully!"
      );
    } else {
      return handleResponse.errorResponse(res, "Images Upload Failed!");
    }
  } catch (err) {
    console.error("multipleImageUpload error!", err);
    return handleResponse.errorResponse(res, "Internal Server Error Occured!");
  }
};

const kycDocuments = async (req, res) => {
  try {
    const data = await kycModel.find()
  return handleResponse.successResponse(res, data, "Kyc Documents");
  } catch (error) {
    console.error("multipleImageUpload error!", error);
    return handleResponse.errorResponse(res, "Internal Server Error Occured!");
  }
}


module.exports = {
  adminSignIn,
  adminSignUp,
  multipleImageUpload,
  kycDocuments,
};
