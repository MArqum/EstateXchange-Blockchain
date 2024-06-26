const router = require("express").Router();
const { celebrate } = require("celebrate");
const propertyController = require("../controllers/propertyController");
const verifyToken = require("../middlewares/verifyToken");
const verifyUser = require("../middlewares/verifyUser")
const permission = require("../middlewares/permission");
const propertyValidations = require("../validations/propertyValidation");

// create property
router
  .route("/created")
  .post(
    [
      celebrate(propertyValidations.createProperty),
      verifyToken,
      permission("user"),
    ],
    propertyController.createProperty
);
  router
  .route("/uploadKycDocuments")
  .post(
    [
      verifyToken,
      permission("user"),
    ],
    propertyController.uploadKycDocuments
  );
router
  .route("/list")
  .get(
    [verifyToken, permission("user", "admin")],
    propertyController.getPropertyList
  );
router
  .route("/approval/:id")
  .get([verifyToken, permission("admin")], propertyController.approveProperty);

router
  .route("/uniqueProertyId")
  .get(
    [verifyToken, permission("user", "admin")],
    propertyController.uniquePropertyID
  );

router
  .route("/updatePropertyStatus")
  .patch(
    [
      celebrate(propertyValidations.updatePropertyStatus),
      // verifyToken, 
      // verifyUser,
      // permission("user")
    ],
    propertyController.updatePropertyStatus
  );

router
  .route("/marketplace/list")
  .get(
    [],
    propertyController.getMarketPropertyList
  );

router
  .route("/rent/list")
  .get(
    [verifyToken, permission("user")],
    propertyController.getRentList
  );

router
  .route("/pay/rent")
  .patch(
    [
      celebrate(propertyValidations.updateRentDate),
      verifyToken,
      permission("user"),
    ],
    propertyController.payRent
  );
module.exports = router;
