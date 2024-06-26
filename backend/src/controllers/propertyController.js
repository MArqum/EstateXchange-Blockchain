const propertyModel = require('../models/propertyListing');
const propertyBuyModel = require('../models/buyedProperty');
const mongoose = require('mongoose');
const mongooseId = mongoose.Types.ObjectId();
const handleResponse = require('../utils/constraints/responseHandler');
const kycModel = require('../models/kyc');

const createProperty = async (req, res) => {
	try {
		// add user id while creating property
		req.body.user = req.user._id;
		if (req.body.user) {
			req.body.remainingQuantity = req.body.tokenQuantity;
			if (req?.body?.rentDate) {
				req.body.rentDate = new Date(req.body.rentDate);
			}
			const data = await propertyModel.create(req.body);
			return handleResponse.createdResponse(res, data, 'Created Successfully!');
		} else {
			return handleResponse.notFoundResponse(res, 'User not found!');
		}
	} catch (err) {
		console.log('Error = ', err);
		handleResponse.errorResponse(res, 'Internal Server Error Occured!');
	}
};

const getPropertyList = async (req, res) => {
	try {
		let query = {};
		// Check if the user is an admin
		if (req.user.role === 'admin') {
			// Admin user, fetch all properties
			query = {};
		} else {
			// Regular user, fetch properties created by the user
			query = { user: req.user._id };
		}

		const data = await propertyModel
			.find(query)
			.populate({
				path: 'user',
				model: 'User',
				select: 'firstname lastname email address city',
			})
			.sort({ createdAt: -1 });

		const propertyCount = await propertyModel.countDocuments(query);

		return handleResponse.successResponse(
			res,
			{
				propertyList: data,
				propertyCount: propertyCount,
			},
			'Property List View Successfully!'
		);
	} catch (error) {
		console.log('Error = ', error);
		handleResponse.errorResponse(res, 'Internal Server Error Occurred!');
	}
};

const approveProperty = async (req, res) => {
	try {
		const propertyId = req.params.id;

		// Find the property and update its approved status
		const property = await propertyModel.findOneAndUpdate(
			{ _id: propertyId },
			{ approved: true, isVerified: true },
			{ new: true }
		);

		if (!property) {
			return handleResponse.notFoundResponse(res, 'Property Not Found!');
		}

		return handleResponse.successResponse(
			res,
			property,
			'Property Approved Successfully!'
		);
	} catch (error) {
		console.error('Error approving property:', error);
		return handleResponse.errorResponse(res, 'Internal Server Error Occured!');
	}
};

const uniquePropertyID = async (req, res) => {
	try {
		console.log('hereree');
		let property = await propertyModel
			.findOne()
			.select('-_id tokenId')
			.sort({ createdAt: -1 });
		// If no property exists, set tokenId to 1
		let tokenId = 1;
		if (property) {
			tokenId = property.tokenId + 1;
		}
		console.log('token id', tokenId);
		return handleResponse.successResponse(
			res,
			tokenId,
			'Next Property token Id!'
		);
	} catch (error) {
		console.error('Error uniquePropertyID property:', error);
		return handleResponse.errorResponse(res, 'Internal Server Error Occured!');
	}
};

const updatePropertyStatus = async (req, res) => {
	try {
		let findquery = {
			//   user: new mongoose.Types.ObjectId(req.user._id),
			tokenId: req?.body?.tokenId,
		};
		let updateQuery = {};
		if (req?.body?.hasOwnProperty('isAddedMarketplace')) {
			updateQuery.isAddedMarketplace = req?.body?.isAddedMarketplace;
		}
		if (req?.body?.hasOwnProperty('remainingQuantity')) {
			updateQuery.remainingQuantity = req.body.remainingQuantity;
		}
		await propertyModel.findOneAndUpdate(findquery, updateQuery);
		const data = await propertyModel.findOne(findquery);

		return handleResponse.createdResponse(
			res,
			data,
			'updated status Successfully!'
		);
	} catch (err) {
		console.log('Error = ', err);
		handleResponse.errorResponse(res, 'Internal Server Error Occured!');
	}
};

const getMarketPropertyList = async (req, res) => {
	try {
		let query = {
			isAddedMarketplace: true,
		};

		const data = await propertyModel.find(query).sort({ createdAt: -1 });

		const propertyCount = await propertyModel.countDocuments(query);
		const filterData = data.filter((item) => item.remainingQuantity > 0);

		return handleResponse.successResponse(
			res,
			{
				propertyList: filterData,
				propertyCount: propertyCount,
			},
			'Property List View Successfully!'
		);
	} catch (error) {
		console.log('Error = ', error);
		handleResponse.errorResponse(res, 'Internal Server Error Occurred!');
	}
};

const getRentList = async (req, res) => {
	try {
		let query = {
			propertyType: 'rental',
			user: req.user._id,
		};

		const data = await propertyModel.find(query).sort({ createdAt: -1 });

		const rentDetails = await Promise.all(
			data.map(async (property) => {
				// console.log(property, "property");

				const rentDetails = await propertyBuyModel.find(
					{
						tokenId: property.tokenId,
					},
					'tokenQuantity rentalPerToken walletAddress user'
				);
				console.log(rentDetails);
				return {
					...property.toObject(),
					rentDetails,
				};
			})
		);
		const propertyCount = await propertyModel.countDocuments(query);

		return handleResponse.successResponse(
			res,
			{
				rentList: rentDetails,
				rentCount: propertyCount,
			},
			'Property Rent List View Successfully!'
		);
	} catch (error) {
		console.log('Error = ', error);
		handleResponse.errorResponse(res, 'Internal Server Error Occurred!');
	}
};

const payRent = async (req, res) => {
	try {
		let query = {
			tokenId: req.body.tokenId,
			user: req.user._id,
		};

		let updateQuery = {
			rentDate: new Date(req.body.rentDate),
		};

		await propertyModel.updateOne(query, updateQuery);

		const data = await propertyModel.findOne(query);
		return handleResponse.successResponse(
			res,
			data,
			'Property Rent Payed Successfully!'
		);
	} catch (error) {
		console.log('Error = ', error);
		handleResponse.errorResponse(res, 'Internal Server Error Occurred!');
	}
};
const uploadKycDocuments = async (req, res) => {
	try {
		const userId = req.user._id;
		console.log(req.body);
		const data = await kycModel.create({ ...req.body, user: userId });
		return handleResponse.successResponse(res, data, 'Kyc Documents uploaded');
	} catch (error) {
		console.error('kyc documents!', error);
		return handleResponse.errorResponse(res, 'Internal Server Error Occured!');
	}
};

module.exports = {
	createProperty,
	getPropertyList,
	approveProperty,
	uniquePropertyID,
	updatePropertyStatus,
	getMarketPropertyList,
	getRentList,
	payRent,
	uploadKycDocuments,
};
