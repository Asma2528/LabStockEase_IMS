const httpStatus = require("http-status")
const { UserModel,ProfileModel } = require("../models")
const ApiError = require("../utils/ApiError")
const { generateToken } = require("../utils/Token.utils")


class AuthService{
    static async RegisterUser(body){
        
        const {email,password,name} = body

        const checkExist = await UserModel.findOne({email})
        if(checkExist){
            throw new ApiError(httpStatus.BAD_REQUEST,"User Already Registered")
            return
        }

    const user =  await UserModel.create({
            email,password,name
        })

        const token = generateToken(user)
        const refresh_token = generateToken(user,'2d')
        await ProfileModel.create({
                    user:user._id,
                    refresh_token
        })  


        return {
            msg:"User Registered Successfully",
            token:token
        }    

}
static  async LoginUser(body){
const {email,password} = body

        const checkExist = await UserModel.findOne({email})
        if(!checkExist){
            throw new ApiError(httpStatus.BAD_REQUEST,"User Not Registered")
            return
        }

        if(password !==checkExist.password){
throw new ApiError(httpStatus.UNAUTHORIZED,"Invalid Credentials")
            return
        }

const token = generateToken(checkExist) 

        return {
            msg:"User Login Successfull",
            token:token
        }    

}
 static  async ProfileService(user){ 

              const checkExist = await UserModel.findById(user).select("name email")
        if(!checkExist){
            throw new ApiError(httpStatus.BAD_REQUEST,"User Not Registered")
            return
        }


        return {
            msg:"Data fetched",
            user:checkExist
        }    

}
}

module.exports = AuthService;