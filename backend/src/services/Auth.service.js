const httpStatus = require("http-status");
const { UserModel, ProfileModel } = require("../models");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/Token.utils");

const axios = require("axios");
class AuthService {
  static async RegisterUser(body) {
    // request
    const { email, password, name, token } = body;

    // console.log("1---- ",token);

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
    // console.log("2---- ",JSON.stringify(data));

    if (!data.success) {

      throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
    }

    const checkExist = await UserModel.findOne({ email });
    if (checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Already Registered");
      return;
    }

    const user = await UserModel.create({
      email,
      password,
      name,
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
    // console.log("2---- ",JSON.stringify(data));

    if (!data.success) {
      // console.log("yhhh it works");

      throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
    }
    const checkExist = await UserModel.findOne({ email });
    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
      return;
    }

    if (password !== checkExist.password) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");
      return;
    }

    const tokend = generateToken(checkExist);

    return {
      msg: "User Login Successfull",
      token: tokend,
    };
  }
  static async ProfileService(user) {
    const checkExist = await UserModel.findById(user).select("name email");
    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
      return;
    }

    return {
      msg: "Data fetched",
      user: checkExist,
    };
  }
}

module.exports = AuthService;
