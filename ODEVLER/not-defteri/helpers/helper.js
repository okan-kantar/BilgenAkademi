const fs = require("fs");
const path = require("path");

const readData = (filePath) => {
  const jsonData = fs.readFileSync(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Dosya okunurken hata oluştu:", err);
      return [];
    }

    return data;
  });

  return JSON.parse(jsonData);
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Dosya yazılırken hata oluştu:", err);
    }
  });
};

const createFileIfNotExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
};

module.exports = {
  readData,
  writeData,
  createFileIfNotExists,
};
