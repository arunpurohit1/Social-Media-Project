const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require("cors");
const HttpError = require("./utils/http-error")
const userRoute = require("./routes/userRoute");
const app = express();
const dotenv = require('dotenv');
dotenv.config()

app.use(bodyParser.json());

app.use(cors());

app.use("/api/v2/user" , userRoute);


app.use((req, res, next) => {
  const error = new HttpError("Page Not Found", 404);
  throw error;
});


app.use((error , req , res , next) => {
    res.status(error.code);
    res.status(500).json({message : error.message || "Unknown Error Occured" , code : error.code  })
})


mongoose.connect(`mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPASS}@cluster0.wfcr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useUnifiedTopology : true,
        useNewUrlParser : true,
        useFindAndModify: false
    
    }).then(() => {
        app.listen(3000 , () =>{
            console.log(`Server Started`)
        })
    }).catch(err => {
        console.log(err)
        const error = new HttpError("Not Connecting to the Database",404);
    }) 