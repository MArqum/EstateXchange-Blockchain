const router = require("express").Router();
const { celebrate } = require("celebrate");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const permission = require("../middlewares/permission");
const userValidation = require("../validations/usersValidation");

// user sign in
// router.route('/signin')
//     .post([
//             celebrate(userValidation.userSignIn)
//         ],
//         userController.userSignIn
//     )

// user register
router
  .route("/created")
  .post([celebrate(userValidation.userSignUp)], userController.userSignUp);

// user list view by admin
router
  .route("/list")
  .get([verifyToken, permission("admin")], userController.getUserList);

// user list view by user
router
  .route("/view")
  .get([verifyToken, permission("user")], userController.getUser);

module.exports = router;
