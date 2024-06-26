const successResponse = (res, data, message) => {
  res.status(200).json({
    data:data,
    success: true,
    message: message || "Success",
  });
};

const successMessageResponse = (res, message) => {
  res.status(200).json({
    success: true,
    message: message || "Success",
  });
};

const errorMessageResponse = (res, message) => {
  res.status(400).json({
    success: false,
    message: message || "Unsuccessful",
  });
};

const createdResponse = (res, obj, message) => {
  res.status(201).json({
    data: obj,
    success: true,
    message: message || "Created",
  });
};

const updateResponse = (res,obj, message) => {
  res.status(202).json({
      data: obj,
      success: true,
      message: message|| 'Updated!',
  });
}
const deleteSuccessResponse = (res, message) => {
  res.status(202).json({
    success: true,
    message: message || "Deleted successfully!",
  });
};

const updateSuccessResponse = (res, message) => {
  res.status(202).json({
    success: true,
    message: message || "Updated successfully!",
  });
};

const existResponse = (res,message) => {
  res.status(409).json({
      data: null,
      success: false,
      message: message|| 'Already exists',
  });
}

const UnAuthorizedResponse = (res,message) => {
  res.status(401).json({
      data: null,
      success: false,
      message: message|| 'UnAuthorized!',
  });
}

const notFoundResponse = (res,message) => {
  res.status(404).json({
      data: null,
      success: false,
      message: message|| 'NotFound!',
  });
}

const notFoundData = (res,message) => {
  res.status(200).json({
      data: [],
      success: true,
      message: message|| 'No Data Found!',
  });
}

const errorResponse = (res,message) => {
  res.status(500).json({
    data: null,
    success: false,
    message: message || "Error Occurred",
  });
};

const errorRequestResponse = (res,message) => {
  res.status(400).json({
    data: null,
    success: false,
    message: message || "Bad Request",
  });
};

const forbiddenResponse = (res, message) => {
  res.status(403).json({
    data: null,
    success: false,
    message: message || "Forbidden",
  });
};

module.exports={
  updateSuccessResponse,
  successResponse,
  errorResponse,
  errorRequestResponse,
  createdResponse,
  existResponse,
  UnAuthorizedResponse,
  notFoundResponse,
  updateResponse,
  deleteSuccessResponse,
  forbiddenResponse,
  successMessageResponse,
  notFoundData,
  errorMessageResponse
}