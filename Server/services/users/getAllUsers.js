const mongoose = require("mongoose");
const User = require("../../models/User");
const { pagination, throwError } = require("../../utils");
const { ROLES } = require("../../constants");

exports.getAllUsers = async (query) => {
  let {
    page,
    limit,
    role,
    search,
    name,
    email,
    mobile,
    isActive,
    categoryId,
    specification,
    specifications,
    pricePerHour,
    minPricePerHour,
    maxPricePerHour,
    experience,
    minExperience,
    maxExperience,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const userMatch = { isDeleted: false, role: { $ne: ROLES.ADMIN } };
  if (typeof isActive !== "undefined") {
    userMatch.isActive = isActive === "true" || isActive === true;
  }

  if (role) {
    role = String(role).toLowerCase();
    userMatch.role = role;
  }

  if (name) userMatch.name = { $regex: new RegExp(name, "i") };
  if (email) userMatch.email = { $regex: new RegExp(email, "i") };
  if (mobile) userMatch.mobile = Number(mobile);

  if (search) {
    userMatch.$or = [
      { name: { $regex: new RegExp(search, "i") } },
      { email: { $regex: new RegExp(search, "i") } },
    ];
    if (!Number.isNaN(Number(search))) {
      userMatch.$or.push({ mobile: Number(search) });
    }
  }

  const pipeline = [{ $match: userMatch }];

  const needMateJoin =
    (userMatch.role && userMatch.role === ROLES.MATE) ||
    typeof role === "undefined" ||
    typeof categoryId !== "undefined" ||
    typeof pricePerHour !== "undefined" ||
    typeof minPricePerHour !== "undefined" ||
    typeof maxPricePerHour !== "undefined" ||
    typeof experience !== "undefined" ||
    typeof minExperience !== "undefined" ||
    typeof maxExperience !== "undefined" ||
    typeof specification !== "undefined" ||
    typeof specifications !== "undefined";

  if (needMateJoin) {
    pipeline.push({
      $lookup: {
        from: "mates",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userId", "$$userId"] },
              isDeleted: false,
            },
          },
        ],
        as: "mate",
      },
    });

    const mustHaveMateDoc = userMatch.role === ROLES.MATE;
    pipeline.push({
      $unwind: {
        path: "$mate",
        preserveNullAndEmptyArrays: !mustHaveMateDoc,
      },
    });

    const mateMatch = {};

    if (categoryId) {
      mateMatch["mate.categoryId"] = new mongoose.Types.ObjectId(categoryId);
    }

    if (typeof pricePerHour !== "undefined") {
      mateMatch["mate.pricePerHour"] = Number(pricePerHour);
    } else if (minPricePerHour || maxPricePerHour) {
      mateMatch["mate.pricePerHour"] = {};
      if (minPricePerHour)
        mateMatch["mate.pricePerHour"].$gte = Number(minPricePerHour);
      if (maxPricePerHour)
        mateMatch["mate.pricePerHour"].$lte = Number(maxPricePerHour);
    }

    if (typeof experience !== "undefined") {
      mateMatch["mate.experience"] = Number(experience);
    } else if (minExperience || maxExperience) {
      mateMatch["mate.experience"] = {};
      if (minExperience)
        mateMatch["mate.experience"].$gte = Number(minExperience);
      if (maxExperience)
        mateMatch["mate.experience"].$lte = Number(maxExperience);
    }

    const specs = specifications || specification;
    if (specs) {
      const arr = Array.isArray(specs)
        ? specs
        : String(specs)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      if (arr.length) mateMatch["mate.specifications"] = { $in: arr };
    }

    if (Object.keys(mateMatch).length) pipeline.push({ $match: mateMatch });

    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "mate.categoryId",
        foreignField: "_id",
        as: "category",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    });
  }

  pipeline.push({
    $project: {
      password: 0,
      otp: 0,
      isDeleted: 0,
      __v: 0,
      "mate.isDeleted": 0,
    },
  });

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  try {
    return await pagination(User, pipeline, page, limit);
  } catch (err) {
    if (err && err.statusCode === 404) throwError(404, "No any user found");
    throw err;
  }
};
