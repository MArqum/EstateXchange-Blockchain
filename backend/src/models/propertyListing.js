const { model, Schema } = require("mongoose");

const PropertySchema = new Schema(
  {
    propertyName: {
      type: String,
      required: true,
    },
    propertyLocation: {
      type: String,
      required: true,
    },
    propertyPrice: {
      type: Number,
      required: true,
    },
    propertyDescription: {
      type: String,
      required: true,
    },
    generateTokens: {
      type: Boolean,
      required: true,
    },
    tokenId: {
      type: Number,
      required: true,
    },
    tokenPrice: {
      type: Number,
      required: true,
    },
    tokenQuantity: {
      type: Number,
      required: true,
    },
    remainingQuantity: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: [String], // Change type to an array of strings
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    propertyType: {
      type: String,
      required: true,
    },
    rentalPrice: {
      type: Number,
      required: false,
    },
    rentDate:{
      type:Date,
      default:null
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAddedMarketplace: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PropertyListing = model("PropertyListing", PropertySchema);
module.exports = PropertyListing;
