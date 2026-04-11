const userService = require("../services/user.service");

async function RegisterUser(req, res) {
  try {
    const result = await userService.registerUser(req.body);

    // JWT store in cookie
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      message: "User Create Successfully",
      user: result.user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function LoginUser(req, res) {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    
    // JWT store in cookie
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "You have successfully logged in.",
      user: result.user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function LogoutUser(req, res) {

  const isProduction = process.env.NODE_ENV === "production"
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction, // true in production
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
}

async function getMe(req, res) {
  res.status(200).json({
    user:req.user,
  });
}

module.exports = {
  RegisterUser,
  LoginUser,
  LogoutUser,
  getMe,
};
