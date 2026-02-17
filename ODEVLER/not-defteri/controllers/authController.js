const {getAllUsersService, createNewUserService} = require("../services/userService");
const bcryptjs = require('bcryptjs');
const tokenService = require('../services/tokenService');

const register = async (req, res) => {
    const {email, password} = req.body;
    const userList = getAllUsersService().users;
    const user = userList.find(user => user.email === email);
    if(user){
        return res.status(400).json({message: 'Bu email zaten kayıtlı!'});
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    createNewUserService({email, password: hashedPassword});
    res.status(201).json({message: 'Kullanıcı başarıyla oluşturuldu!'});
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const userList = getAllUsersService().users;
    const user = userList.find(user => user.email === email);

    if(!user){
        return res.status(400).json({message: 'Email veya şifre yanlış!'});
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({message: 'Email veya şifre yanlış!'});
    }

    // token mekanizması
    const tokens = tokenService.generateTokens(user);
    tokenService.saveToken(user.id, tokens.refreshToken);

    res.status(200).json({message: 'Giriş başarılı!', ...tokens});
}

const refreshToken = async (req, res) => {
  try {
    const oldRefrehToken = req.body.refreshToken;
    if(oldRefrehToken){
        tokenService.removeToken(oldRefrehToken);
    }

    const tokens = tokenService.generateTokens(req.user);
    tokenService.saveToken(req.user.id, tokens.refreshToken);
    res.status(200).json({message: 'Token yenilendi!', ...tokens});

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
    register,
    login,
    refreshToken
};