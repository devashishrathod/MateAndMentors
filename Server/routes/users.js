const express = require("express");
const router = express.Router();

const {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { verifyJwtToken } = require("../middlewares");

router.get("/get", verifyJwtToken, getUser);
router.get("/getAll", verifyJwtToken, getAllUsers);
router.put("/update", verifyJwtToken, updateUser);
router.delete("/delete", verifyJwtToken, deleteUser);

module.exports = router;
