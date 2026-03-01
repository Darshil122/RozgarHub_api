const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(userData){
    const {fullname, contact, email, password, role} = userData;
    const existUser = await User.findOne({
      $or: [{ contact }, { email }],
    });

    if (existUser) {
      if (existUser.email === email) {
        throw new Error("Email already registered");
      }
      if (existUser.contact === contact) {
        throw new Error("Contact number already registered");
      }
    }


    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullname,
        contact,
        password:hashPassword,
        email,
        role
    });

    const token = jwt.sign({id: newUser._id, email}, process.env.JWT_SECRET,{
        expiresIn: "7d",
    });

    return {
        token, 
        newUser: {fullname, contact, email, role}
    };
}

async function loginUser(email, password){
const user = await User.findOne({email}).select("+password");

if(!user){
    throw new Error("Invalid Email/Password");
}

const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
    throw new Error("Password does not match");
}

const token = jwt.sign({id: user._id, email}, process.env.JWT_SECRET,{
    expiresIn:"7d",
});

return {token, user:{role: user.role}};

}

module.exports = {
    registerUser,
    loginUser
}