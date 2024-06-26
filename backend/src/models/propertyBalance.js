const { model, Schema } = require("mongoose");

const PropertyBalanceSchema = new Schema(
    {
        propertyName: {
            type: String,
            required: true,
        },
        propertyPrice: {
            type: Number,
            required: true,
        },
        tokenId: {
            type: Number,
            required: true,
        },
        rentToken:{
            type: Number,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        walletAddress: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true,
    }
);

const PropertyBalance = model("PropertyBalance", PropertyBalanceSchema);
module.exports = PropertyBalance;
