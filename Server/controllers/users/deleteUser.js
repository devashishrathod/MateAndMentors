const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteUserById } = require("../../services/users");

exports.deleteUser = asyncWrapper(async (req, res) => {
  const userId = req.query?.userId || req.userId;
  await deleteUserById(userId);
  return sendSuccess(res, 200, "User deleted successfully");
});
