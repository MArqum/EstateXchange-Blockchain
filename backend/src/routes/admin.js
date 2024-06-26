const router = require("express").Router();
const { celebrate } = require("celebrate");
const adminController = require("../controllers/adminController");
const verifyToken = require('../middlewares/verifyToken')
const permission = require('../middlewares/permission')
const adminValidations = require("../validations/adminValidation");

// admin sign in
router
  .route("/signin")
  .post([celebrate(adminValidations.adminSignIn)], adminController.adminSignIn);

// create admin
router
  .route("/created")
  .post([celebrate(adminValidations.adminSignUp)], adminController.adminSignUp);

router.route("/file/Upload")
  .post(adminController.multipleImageUpload);

router
  .route("/created")
  .post([celebrate(adminValidations.adminSignUp)], adminController.adminSignUp);

router
  .route('/getKycList')
  .get([
    [
      verifyToken,
      permission("admin"),
    ],
  ],adminController.kycDocuments);

module.exports = router;
