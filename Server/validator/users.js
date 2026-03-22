const Joi = require("joi");
// const objectId = require("./validJoiObjectId");

exports.validateUpdateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).messages({
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should not exceed {#limit} characters",
    }),
    address: Joi.string().allow("").max(300).messages({
      "string.max": "Address cannot exceed {#limit} characters",
    }),
    dob: Joi.date().iso().messages({
      "date.format":
        "Date of birth must be a valid date in ISO format (YYYY-MM-DD)",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address",
    }),
    mobile: Joi.number().integer().min(1000000000).max(9999999999).messages({
      "number.base": "Mobile number must be numeric",
      "number.min": "Mobile number must be 10 digits",
      "number.max": "Mobile number must be 10 digits",
    }),
    // categoryId: objectId().messages({ "any.invalid": "Invalid categoryId" }),
    pricePerMin: Joi.number().positive().messages({
      "number.base": "pricePerMin must be numeric",
      "number.positive": "pricePerMin must be > 0",
    }),
    priceUnit: Joi.string().valid("RUPEE", "USD").messages({
      "any.only": "priceUnit must be one of RUPEE, USD",
    }),
    experience: Joi.number().min(0).messages({
      "number.base": "experience must be numeric",
      "number.min": "experience must be >= 0",
    }),
    specifications: Joi.array().items(Joi.string().trim()).messages({
      "array.base": "specifications must be an array",
    }),
    language: Joi.string().trim().messages({
      "string.base": "language must be a string",
    }),
    languages: Joi.array().items(Joi.string().trim()).messages({
      "array.base": "languages must be an array",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};
