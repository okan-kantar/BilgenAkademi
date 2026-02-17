const fs = require("fs");
const path = require("path");
const {
  getAllUsersService,
  getUserByIdService,
  createNewUserService,
  updateUserService,
  deleteUserService,
} = require("../services/userService");

const getAllUsers = (req, res) => {
  const data = getAllUsersService();
  res.status(200).json(data);
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  const data = getUserByIdService(userId);
  if (data.success) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "Kullanıcı bulunamadı!" });
  }
};

const createNewUser = (req, res) => {
  const { newUser } = req.body;
  const data = createNewUserService(newUser);
  res.status(201).json(data);
};

const updateUser = (req, res) => {
  const { id: userId, email } = req.body;
  const data = updateUserService(userId, email);
  res.status(200).json(data);
};

const deleteUser = (req, res) => {
  const { userId } = req.params;
  const data = deleteUserService(userId);
  res.status(200).json(data);
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
};
