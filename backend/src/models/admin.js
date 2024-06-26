// admin model
const { model, Schema } = require("mongoose");

const AdminSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	role:{
    type: String,
    default: 'admin',
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
	}
  
},{
    timestamps: true,
    });
 

const user = model("Admin", AdminSchema);
module.exports = user;