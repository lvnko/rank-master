const express = require("express");
const mongoose = require("mongoose");
const { dirname, join } = require('path');
const { readdirSync, lstatSync } = require('fs');
const { fileURLToPath } = require('url');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const cors = require("cors");
const router = require("./router");
const { commonNonActiveEndpointReply } = require('./utilities');
const corsOptions = {
    origin: "http://localhost:5173"
};
const { Schema, Types } = mongoose;
const app = express();
const port = 8081;
const portMongodbDefault = 27017;

async function connectToMongoDB() {
    try {
        await mongoose.connect(`mongodb://localhost:${portMongodbDefault}/RankMaster`, {
            // useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();

const localesFolder = join(__dirname, './locales');

i18next
    .use(middleware.LanguageDetector)
    .use(Backend)
    .init({
        debug: true,
        ns: ['common', 'message', 'translation'],
        defaultNS: 'common',
        initImmediate: false,
        fallbackLng: ['en-US'],
        supportedLngs: ['en-US', 'zh-TW'],
        load: 'currentOnly',
        preload: readdirSync(localesFolder).filter((fileName) => {
            const joinedPath = join(localesFolder, fileName)
            return lstatSync(joinedPath).isDirectory()
        }),
        // backend: { loadPath: join(localesFolder, '{{lng}}/{{ns}}.json') },
        backend: { loadPath: join(__dirname, 'locales/{{lng}}/{{ns}}.json') },
        detection: { order: ['querystring', 'header'], lookupQuerystring: 'lng' },
    });

app.use(cors(corsOptions));
app.use(middleware.handle(i18next));
// app.use('/locales', express.static('locales'));
app.use(express.json());
app.use(express.urlencoded(
    { extended: false }
));

app.use('/', router);

app.use(commonNonActiveEndpointReply);

app.listen(port, ()=>{
    console.log(`Server is now responsding on port ${port}!!!`);
});

