const User = require("../../models/User");
const Mate = require("../../models/Mate");
// const { validateObjectId } = require("../../utils");
const { ROLES, LOGIN_TYPES } = require("../../constants");
const { asyncWrapper, sendSuccess, throwError } = require("../../utils");
const { uploadImage } = require("../../services/uploads");
const { getOrCreateWallet } = require("../../services/wallet");

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
    bio,
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
  bio = bio?.trim();
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
      const specificationsArr = Array.isArray(specifications)
        ? specifications
        : specifications.split(",");
      specifications = specificationsArr
        .filter((s) => typeof s === "string")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      specifications = [];
    }
    if (typeof languages !== "undefined") {
      const languagesArr = Array.isArray(languages)
        ? languages
        : languages.split(",");
      languages = languagesArr
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
  let responseMessage = "Mate registered successfully";
  if (user && !isMate) {
    await getOrCreateWallet(user._id);
    responseMessage =
      "User registered successfully, Welcome! You get 10 minutes free call";
  }
  if (isMate) {
    const matePayload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      bio,
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
  return sendSuccess(res, 201, responseMessage, { user, token });
});
