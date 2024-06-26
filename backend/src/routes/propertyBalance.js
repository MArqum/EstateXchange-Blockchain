const router = require("express").Router();
const { celebrate } = require("celebrate");
const propertyBalanaceController = require("../controllers/propertyBalanceController")
const verifyToken = require("../middlewares/verifyToken");
const verifyUser = require("../middlewares/verifyUser")
const permission = require("../middlewares/permission");
const propertyBalanceValidations = require("../validations/propertyBalanceValidation");

// create property
router
    .route("/rent/created")
    .post(
        [
            celebrate(propertyBalanceValidations.createRentProperty),
            verifyToken,
            permission("user"),
        ],
        propertyBalanaceController.propertyRentCreated
    );

router
    .route("/rent/list")
    .get(
        [verifyToken, permission("user", "admin")],
        propertyBalanaceController.getPropertyRentList
    );

module.exports = router;
