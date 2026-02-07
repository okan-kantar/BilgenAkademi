const fs = require('node:fs');
const path = require('node:path');

const registerUser = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const newUser = { id: Math.random(), email, password };

    const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    const findUser = users.find((user) => user.email === email);

    if (findUser) {
      return res
        .status(400)
        .json({ message: 'Bu email adresi zaten kayıtlı!' });
    }

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    const findUser = users.find((user) => user.email === email && user.password === password);

    if (!findUser) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    res.status(200).json({ message: 'Giriş başarılı!', findUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
