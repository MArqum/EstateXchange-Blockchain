const { model, Schema } = require("mongoose");

const kycSchema = new Schema({
    frontIdCard: {
        type: String,
        required: true
    },
    backIdCard: {
        type: String,
        required: true
    },
    propertyDocuments: {
        type: [String],
        required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},
 {
    timestamps: true,
    });

const kycDocuments = model("Kyc", kycSchema);
module.exports = kycDocuments;

