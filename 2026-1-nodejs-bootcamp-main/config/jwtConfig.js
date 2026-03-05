module.exports = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '1m', // Short-lived
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d', // Longer-lived
  },
};
