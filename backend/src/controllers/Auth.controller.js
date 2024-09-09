// Auth.controller.js
const AuthService = require("../services/Auth.service");
const CatchAsync = require("../utils/CatchAsync");
const httpStatus = require("http-status");

class AuthController {
    static RegisterUser = CatchAsync(async(req, res) => {
        const res_obj = await AuthService.RegisterUser(req.body);
        res.status(httpStatus.CREATED).send(res_obj);  // 201 code tells that the data is created 
    })

    static LoginUser = CatchAsync(async(req, res) => {
        const res_obj = await AuthService.LoginUser(req.body);
        res.status(httpStatus.OK).send(res_obj)
    })

    static ProfileController = CatchAsync(async(req, res) => {
        const res_obj = await AuthService.ProfileService(req.user);
        res.status(httpStatus.OK).send(res_obj)
    })
}

module.exports = AuthController;
