// This file is used to declare public variables which will be used multiple times in the project
// This file will contain public data, private data, express data, etc

class PUBLIC_DATA{
    // If 1st option is not there then the 2nd option will be evaluated (i.e after ||)
    static port = process.env.PORT || 4000
    static mongo_uri = process.env.MONGO_URI || `mongodb://localhost/LabStockEase`
      static jwt_auth = process.env.JWT_AUTH || "@#$%^&*(@#$%^&*($%^))#$%^&"
}

module.exports = {
    PUBLIC_DATA //for importing multiple packages we use this syntax
}