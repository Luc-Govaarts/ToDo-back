module.exports = {
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
    PORT: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET
  };
  