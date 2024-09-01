// This file is for handling asynchronous error 

const CatchAsync = (func) => (req,res,next) =>{
    return Promise.resolve(func(req,res,next)).catch((err)=>{
        console.log("Promise cannot be breaked"+err);
        next(err)
    })
}

module.exports = CatchAsync