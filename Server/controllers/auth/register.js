const User = require("../../models/User");
const Mate = require("../../models/Mate");
// const { validateObjectId } = require("../../utils");
const { ROLES, LOGIN_TYPES } = require("../../constants");
const { asyncWrapper, sendSuccess, throwError } = require("../../utils");
const { uploadImage } = require("../../services/uploads");

exports.register = asyncWrapper(async (req, res) => {
  let {
    name,
    email,
    password,
    cofirmPassword,
    mobile,
    role,
    loginType,
    fcmToken,
    // categoryId,
    pricePerMin,
    priceUnit,
    experience,
    specifications,
    languages,
  } = req.body;
  const image = req.files?.image;
  if (!mobile && !email) {
    throwError(422, "Email or Mobile number any one of this is required");
  }
  email = email?.toLowerCase();
  name = name?.toLowerCase();
  role = role?.toLowerCase() || ROLES.USER;
  loginType = loginType?.toLowerCase() || LOGIN_TYPES.PASSWORD;
  const isMate = role === ROLES.MATE;
  if (password && cofirmPassword && password !== cofirmPassword) {
    throwError(422, "Password and confirm password must be same");
  }
  if (isMate) {
    // if (!categoryId) throwError(422, "categoryId is required");
    // validateObjectId(categoryId, "categoryId");
    // if (typeof pricePerMin === "undefined")
    //   throwError(422, "pricePerMin is required");
    if (pricePerMin && Number(pricePerMin) <= 0) {
      throwError(422, "pricePerMin must be > 0");
    }
    // if (typeof priceUnit === "undefined")
    //   throwError(422, "priceUnit is required");
    // if (typeof experience === "undefined")
    //   throwError(422, "experience is required");
    if (experience && Number(experience) < 0) {
      throwError(422, "experience must be >= 0");
    }
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
    if (typeof languages !== "undefined") {
      if (!Array.isArray(languages)) {
        throwError(422, "languages must be an array");
      }
      languages = languages
        .filter((l) => typeof l === "string")
        .map((l) => l.trim())
        .filter(Boolean);
    } else {
      languages = [];
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
  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);

  const userData = {
    name,
    password,
    email,
    mobile,
    role,
    fcmToken,
    loginType,
    image: imageUrl,
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
      // categoryId,
      pricePerMin: pricePerMin ? Number(pricePerMin) : 12,
      priceUnit: priceUnit || "RUPEE",
      experience: experience ? Number(experience) : 0,
      specifications,
      languages,
    };
    await Mate.create(matePayload);
  }
  const token = user.getSignedJwtToken();
  return sendSuccess(res, 201, "User registered successfully", { user, token });
});
