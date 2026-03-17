const User = require("../../models/User");
const Mate = require("../../models/Mate");
const { throwError } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");
const { isAdult } = require("../../helpers/users");
const { ROLES } = require("../../constants");
const { validateObjectId } = require("../../utils");

exports.updateUserById = async (userId, payload, image) => {
  const user = await User.findById(userId);
  if (!user || user?.isDeleted) throwError(404, "User not found");
  const isMate = user.role === ROLES.MATE;

  const mateUpdate = {};
  if (payload) {
    let {
      name,
      email,
      mobile,
      dob,
      address,
      categoryId,
      pricePerHour,
      experience,
      specifications,
    } = payload;
    if (name) user.name = name?.toLowerCase();
    if (address) user.address = address?.toLowerCase();
    if (dob) {
      if (!isAdult(dob)) throwError(400, "User must be at least 18 years old");
      user.dob = dob;
    }
    if (email && email !== user.email) {
      email = email?.toLowerCase();
      const emailExists = await User.findOne({
        email,
        role: user.role,
        _id: { $ne: userId },
        isDeleted: false,
      });
      if (emailExists) {
        throwError(400, "Email already exists with another user");
      }
      user.email = email;
      user.isEmailVerified = false;
    }
    if (mobile && mobile !== user.mobile) {
      const mobileExists = await User.findOne({
        mobile,
        role: user.role,
        _id: { $ne: userId },
        isDeleted: false,
      });
      if (mobileExists) {
        throwError(400, "Mobile number already exists with another user");
      }
      user.mobile = mobile;
      user.isMobileVerified = false;
    }

    if (isMate) {
      if (typeof categoryId !== "undefined") {
        validateObjectId(categoryId, "categoryId");
        mateUpdate.categoryId = categoryId;
      }
      if (typeof pricePerHour !== "undefined") {
        if (Number(pricePerHour) <= 0)
          throwError(422, "pricePerHour must be > 0");
        mateUpdate.pricePerHour = Number(pricePerHour);
      }
      if (typeof experience !== "undefined") {
        if (Number(experience) < 0) throwError(422, "experience must be >= 0");
        mateUpdate.experience = Number(experience);
      }
      if (typeof specifications !== "undefined") {
        if (!Array.isArray(specifications)) {
          throwError(422, "specifications must be an array");
        }
        mateUpdate.specifications = specifications
          .filter((s) => typeof s === "string")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  }
  if (image) {
    if (user.image) await deleteImage(user.image);
    const imageUrl = await uploadImage(image.tempFilePath);
    user.image = imageUrl;
  }
  await user.save();

  if (isMate) {
    const baseSync = {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    };

    const hasMateChanges = Object.keys(mateUpdate).length > 0;
    if (hasMateChanges || baseSync.name || baseSync.email || baseSync.mobile) {
      const existingMate = await Mate.findOne({
        userId: user._id,
        isDeleted: false,
      });

      if (existingMate) {
        await Mate.updateOne(
          { _id: existingMate._id },
          { $set: { ...baseSync, ...mateUpdate } },
        );
      } else {
        const canCreateMate =
          typeof mateUpdate.categoryId !== "undefined" &&
          typeof mateUpdate.pricePerHour !== "undefined" &&
          typeof mateUpdate.experience !== "undefined";

        if (canCreateMate) {
          await Mate.create({
            userId: user._id,
            ...baseSync,
            ...mateUpdate,
          });
        }
      }
    }
  }

  const { password, otp, ...userData } = user.toObject();
  return userData;
};
