// user model
const { model, Schema } = require("mongoose");

const UsersSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },

    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const user = model("User", UsersSchema);
module.exports = user;
