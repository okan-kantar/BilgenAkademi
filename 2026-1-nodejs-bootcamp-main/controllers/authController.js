const fs = require('node:fs');
const path = require('node:path');
const bcryptjs = require('bcryptjs');

const registerUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let newUser = { id: Math.random(), email, password };

    const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    const findUser = users.find((user) => user.email === email);

    if (findUser) {
      return res
        .status(400)
        .json({ message: 'Bu email adresi zaten kayıtlı!' });
    }

    // Password hash'leme
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    newUser = {
      ...newUser,
      password: hashedPassword,
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    const findUser = users.find((user) => user.email === email);

    if (!findUser) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Şifre Kontrolü                             // 123456     // $2b$10$bdH29/sfSfi0u0OYf2YZl.WQNaFJw8QpJBmVxz3afxKXdEhx.gntK    
    const validPassword = await bcryptjs.compare(password, findUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const { password: _, ...user } = findUser;

    res.status(200).json({ message: 'Giriş başarılı!', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
