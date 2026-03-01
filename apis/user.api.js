const userService = require("../services/user.service");

async function RegisterUser(req, res) {
  try {
    const result = await userService.registerUser(req.body);
    return res.status(200).json({
      message: "User Create Successfully",
      ...result,
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

    return res.status(200).json({
      message: "You have successfully logged in.",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getMe(req, res) {
  res.status(200).json({
    user:req.user,
  });
}

module.exports = {
  RegisterUser,
  LoginUser,
  getMe,
};
