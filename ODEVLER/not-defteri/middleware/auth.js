const jwt = require("jsonwebtoken");
const { accessToken, refreshToken } = require("../config/jwtConfig");
const tokenService = require("../services/tokenService");

const verifyAccessToken = (req, res, next) => {
  // header'dan jwt'yi al
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token> Bearer kısmını atmak için split kullanıyoruz

  if (!token) {
    return res
      .status(403)
      .json({ message: "Token gerekli! Lütfen giriş yapınız!" });
  }

  try {
    const decoded = jwt.verify(token, accessToken.secret);
    req.user = decoded; // decoded bilgilerini req.user'a atıyoruz, böylece diğer middleware'lerde veya route handler'larda erişebiliriz
    next(); // token doğrulandıktan sonra bir sonraki middleware'e geçiyoruz
  } catch (err) {
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

const verifyRefreshToken = (req, res, next) => {
    const {refreshToken:token} = req.body;

    if(!token){
        return res.status(403).json({message: "Refresh token required"});
    }

    try{
        const storefToken = tokenService.findToken(token);
        if(!storefToken){
            return res.status(403).json({message: "Invalid refresh token"});
        }

        const decoded = jwt.verify(token, refreshToken.secret);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message: "Invalid or expired refresh token"});
    }
};

module.exports = { verifyAccessToken, verifyRefreshToken };
