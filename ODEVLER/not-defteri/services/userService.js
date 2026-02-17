const fs = require("fs");
const path = require("path");
const { readData, writeData } = require("../helpers/helper");

const filePath = path.join(__dirname, "..", "models", "users.json");

const getAllUsersService = () => {
  const data = readData(filePath);
  return { success: true, users: data };
};

const getUserByIdService = (userId) => {
  const users = readData(filePath);
  const findUser = users.find((u) => u.id == Number(userId));
  if (findUser) {
    return { success: true, user: findUser };
  } else {
    return { success: false, message: "Kullanıcı bulunamadı!" };
  }
};

const createNewUserService = (newUser) => {
  const users = readData(filePath);
  const newId = users.length ? users[users.length - 1].id + 1 : 1;
  const user = { id: newId, ...newUser };
  const newUsers = [...users, user];
  writeData(filePath, newUsers);
  return { success: true, user };
};

const updateUserService = (userId, email) => {
  let users = readData(filePath);
  const findUser = users.find((u) => u.id === userId);

  if (findUser) {
    users = users.map((user) => {
      if (user.id === findUser.id) {
        return { ...user, email };
      }

      return user;
    });
  }
  writeData(filePath, users);
  return { success: true, users };
};

const deleteUserService = (userId) => {
  let users = readData(filePath);
  users = users.filter((user) => user.id !== Number(userId));
  writeData(filePath, users);
  return { success: true, users };
};

module.exports = {
  getAllUsersService,
  getUserByIdService,
  createNewUserService,
  updateUserService,
  deleteUserService,
};
