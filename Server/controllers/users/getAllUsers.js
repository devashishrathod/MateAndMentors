const { asyncWrapper, sendSuccess } = require("../../utils");
const { getAllUsers } = require("../../services/users");

exports.getAllUsers = asyncWrapper(async (req, res) => {
  const result = await getAllUsers(req.query);
  return sendSuccess(res, 200, "Users fetched successfully", result);
});
