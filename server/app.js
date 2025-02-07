const express = require("express");
const mongoose = require("mongoose");
const router = require("./router");
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:5173"
};
const { Schema, Types } = mongoose;
const app = express();
const port = 8081;
const portMongodbDefault = 27017;

mongoose.connect(`mongodb://localhost:${portMongodbDefault}/RankMaster`, {
    // useNewUrlParser: true,
    useUnifiedTopology: true
});

// parse req.body
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded(
    { extended: false }
));

app.use('/', router);

app.listen(port, ()=>{
    console.log(`Server is now responsding on port ${port}!!!`);
});