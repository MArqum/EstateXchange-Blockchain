const router = require("express").Router();
const { celebrate } = require("celebrate");
const propertyBuyController = require("../controllers/buyedPropertyController")
const verifyToken = require("../middlewares/verifyToken");
const verifyUser = require("../middlewares/verifyUser")
const permission = require("../middlewares/permission");
const propertyBuyValidations = require("../validations/buyedPropertyValidation");

// create property
router
    .route("/buyed/created")
    .post(
        [
            celebrate(propertyBuyValidations.createBuyedProperty),
            verifyToken,
            permission("user"),
        ],
        propertyBuyController.buyedPropertyMarketplace
    );

router
    .route("/buyed/list")
    .get(
        [verifyToken, permission("user", "admin")],
        propertyBuyController.getBuyedPropertyList
    );

module.exports = router;
