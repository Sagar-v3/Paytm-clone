const express = require("express");
const jsonwebtoken = require('jsonwebtoken');
const {User} = require("./db");
const cors = require('cors');
const rootRouter = require("./routes/index");
const userRouter = require("./routes/user");
const accountRouter = require("./routes/account");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1", rootRouter);
app.use('/api/v1/user', userRouter);
app.use("/app/v1/account", accountRouter);


app.listen(3000, (err) => {
    if(err) console.log(err);

    console.log("App is successfully up & running on port 3000");
});


module.exports = app;