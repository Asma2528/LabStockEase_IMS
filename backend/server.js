require("dotenv").config({ //using this syntax as we dont want to keep a name of it, to make it default

})

const {PUBLIC_DATA} = require("./constant");
const app = require("./src/app");

app.listen(PUBLIC_DATA.port,()=>{
    console.log(`The app is listen at http://localhost:${PUBLIC_DATA.port}`);
})

const {ConnectDB} = require("./src/config/db.config");

ConnectDB();