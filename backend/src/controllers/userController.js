const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const mongooseId = mongoose.Types.ObjectId();
const handleResponse = require("../utils/constraints/responseHandler");

// user login
const userSignIn = async (req, res) => {
    try {
        // find email
        let user = await userModel.findOne({ email: req.body.email });
        console.log("user", user);
        if (user) {
            // compare passwords
            bcrypt.compare(req.body.password, user.password, async (err, valid) => {
                if (err) {
                    throw err; // handle error
                }
                if (valid) {
                    // generate token with expiry of 1 year
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

                    // Reassign user object with additional properties
                    user = {
                        _id: user._id,
                        email: user.email,
                        role: user.role,
                        token,
                    };

                    handleResponse.successResponse(res, user, "Logged in Successfully!");
                } else {
                    handleResponse.errorResponse(
                        res,
                        "Email and password are incorrect!"
                    );
                }
            });
        } else {
            handleResponse.notFoundResponse(res, "User not found!");
        }
    } catch (err) {
        console.log("Error = ", err);
        handleResponse.errorResponse(res, "Internal Server Error Occurred!");
    }
};

// user register
const userSignUp = async (req, res) => {
    try {
        // find email
        let users = await userModel.findOne(
            { email: req.body.email },
            { email: 1 }
        );
        if (!users) {
            // encrypt user password
            const salt = bcrypt.genSaltSync(10);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
            let data = await userModel.create(req.body);
            handleResponse.createdResponse(res, data, "Created Successfully!");
        } else {
            handleResponse.existResponse(res, "Email Already Exists!");
        }
    } catch (err) {
        console.log("Error = ", err);
        handleResponse.errorResponse(res, "Internal Server Error Occurred!");
    }
};

// user list view by admin
const getUserList = async (req, res) => {
    try {
        const data = await userModel
            .find({}, "firstname lastname email address city")
            .sort({ createdAt: -1 })
            .exec();

        const userListCount = await userModel.countDocuments(data);
        return handleResponse.successResponse(
            res,
            {
                userList: data,
                userCount: userListCount,
            },
            "User List View Successfully!"
        );
    } catch (error) {
        console.log("Error = ", error);
        handleResponse.errorResponse(res, "Internal Server Error Occurred!");
    }
};

// get user by id
const getUser = async (req, res) => {
    try {
        const data = await userModel.findOne({ _id: req.user._id });
        if (data) {
            return handleResponse.successResponse(
                res,
                data,
                "User View Successfully!"
            );
        } else {
            return handleResponse.notFoundResponse(res, "User Not Found!");
        }
    } catch (error) {
        console.log("Error = ", error);
        handleResponse.errorResponse(res, "Internal Server Error Occurred!");
    }
};

module.exports = {
    // userSignIn,
    userSignUp,
    getUserList,
    getUser,
};
