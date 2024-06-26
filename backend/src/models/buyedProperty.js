const { model, Schema } = require("mongoose");

const BuyedPropertySchema = new Schema(
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
    tokenId: {
      type: Number,
      required: true,
    },
    buyedPrice: {
      type: Number,
      required: true,
    },
    tokenQuantity: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: [String], // Change type to an array of strings
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    rentalPerToken: {
      type: Number,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletAddress: {
      type:String,
      required: true
    },

  },
  {
    timestamps: true,
  }
);

const buyPropertyListing = model("BuyedProperty", BuyedPropertySchema);
module.exports = buyPropertyListing;
