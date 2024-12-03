// Auth.service.js
const httpStatus = require("http-status");
const { UserModel, ProfileModel } = require("../models");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/Token.utils");
const axios = require("axios");

class AuthService {
  static async RegisterUser(body) {
    const { email, password, name, role, token } = body;

    if (!role || !['admin', 'chemistry', 'physics', 'biology', 'botany', 'microbiology', 'lifescience','chemistry-faculty'].includes(role)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Valid role is required");
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: process.env.CAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const data = await response.data;

    if (!data.success) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
    }

    const checkExist = await UserModel.findOne({ email });
    if (checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Already Registered");
    }

    const user = await UserModel.create({
      email,
      password,
      name,
      role
    });

    const tokend = generateToken(user);
    const refresh_token = generateToken(user, "2d");
    await ProfileModel.create({
      user: user._id,
      refresh_token,
    });

    return {
      msg: "User Registered Successfully",
      token: tokend,
    };
  }

  static async LoginUser(body) {
    const { email, password, token } = body;

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      {},
      {
        params: {
          secret: process.env.CAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const data = await response.data;

    if (!data.success) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
    }

    const checkExist = await UserModel.findOne({ email });
    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
    }

    if (password !== checkExist.password) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");
    }

    const tokend = generateToken(checkExist);

    return {
      msg: "User Login Successful",
      token: tokend,
      role: checkExist.role,
    };
  }

  static async ProfileService(user) {
    const checkExist = await UserModel.findById(user.id).select("name email role"); // Use user.id
    if (!checkExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
    }

    return {
        msg: "Data fetched",
        user: checkExist,
    };
}

}

module.exports = AuthService;
