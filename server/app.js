const express = require("express");
const mongoose = require("mongoose");
const router = require("./router");
// const { standardErrorHandler, customErrorHandler } = require("./utilities");
const { Schema, Types } = mongoose;
const app = express();
const port = 8081;
const portMongodbDefault = 27017;

mongoose.connect(`mongodb://localhost:${portMongodbDefault}/RankMaster`, {
    // useNewUrlParser: true,
    useUnifiedTopology: true
});

// parse req.body
app.use(express.json());
app.use(express.urlencoded(
    { extended: false }
));

app.use('/', router);

app.listen(port, ()=>{
    console.log(`Server is now responsding on port ${port}!!!`);
});