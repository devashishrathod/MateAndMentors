const User = require("../../models/User");
const Mate = require("../../models/Mate");
const { validateObjectId } = require("../../utils");
const { ROLES, LOGIN_TYPES } = require("../../constants");
const { asyncWrapper, sendSuccess, throwError } = require("../../utils");

exports.register = asyncWrapper(async (req, res) => {
  let {
    name,
    email,
    password,
    mobile,
    role,
    loginType,
    fcmToken,
    categoryId,
    pricePerHour,
    experience,
    specifications,
  } = req.body;
  if (!mobile && !email) {
    throwError(422, "Email or Mobile number any one of this is required");
  }
  email = email?.toLowerCase();
  name = name?.toLowerCase();
  role = role?.toLowerCase() || ROLES.USER;
  loginType = loginType?.toLowerCase() || LOGIN_TYPES.PASSWORD;
  const isMate = role === ROLES.MATE;
  if (isMate) {
    if (!categoryId) throwError(422, "categoryId is required");
    validateObjectId(categoryId, "categoryId");
    if (typeof pricePerHour === "undefined")
      throwError(422, "pricePerHour is required");
    if (Number(pricePerHour) <= 0) throwError(422, "pricePerHour must be > 0");
    if (typeof experience === "undefined")
      throwError(422, "experience is required");
    if (Number(experience) < 0) throwError(422, "experience must be >= 0");
    if (typeof specifications !== "undefined") {
      if (!Array.isArray(specifications)) {
        throwError(422, "specifications must be an array");
      }
      specifications = specifications
        .filter((s) => typeof s === "string")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      specifications = [];
    }
  }
  let user;
  if (email) {
    user = await User.findOne({ email, role, isDeleted: false });
    if (user) throwError(400, "User with this email already exists");
  }
  if (mobile) {
    user = await User.findOne({ mobile, role, isDeleted: false });
    if (user) throwError(400, "User with mobile number already exists");
  }
  const userData = {
    name,
    password,
    email,
    mobile,
    role,
    fcmToken,
    loginType,
    isLoggedIn: true,
    isOnline: true,
  };
  user = await User.create(userData);

  if (isMate) {
    const matePayload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      categoryId,
      pricePerHour: Number(pricePerHour),
      experience: Number(experience),
      specifications,
    };
    await Mate.create(matePayload);
  }
  const token = user.getSignedJwtToken();
  return sendSuccess(res, 201, "User registered successfully", { user, token });
});
