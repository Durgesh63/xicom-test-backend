const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { CORS_ORIGINE } = require('./constant');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express()
/**
 * CORS
 */

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || CORS_ORIGINE.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed to access'));
        }
    },
    credentials: true, // This is what allows credentials to be included
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))

/**
 * Requset body  parsing middleware should be above any other middleware that needs to access the request body.
 */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  // support encoded bodies

/**
 * Serve static  files from the `public` folder.
 * https://expressjs.com/en/starter/static-files.html
 */
app.use(express.static("public"));

/**
 * cookie parser
 */
app.use(cookieParser())

/**
 * Routes Import
 */
const candidaterouter = require('./Routes/candidate.routes');

/**
 * Routes definations in the application
 */

app.use("/api/v1", candidaterouter)


app.use("*", (req, res) => {
    res.status(404).end({
        message: "404 Not Found!"
    })
})

app.use(errorHandler);

module.exports = { app }