export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 5; // default fallback to 5 days

  console.log('Setting cookie:', token);
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
