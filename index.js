require('dotenv').config()
const express = require("express");
const loggerMiddleWare = require("morgan");
const corsMiddleWare = require("cors");
const bodyParserMiddleWare = express.json();
const { PORT } = require("./config/constants");
const authMiddleWare = require("./auth/middleware");
const authRouter = require("./routers/auth");
const deleteNonVerifiedUsers = require('./auth/deleteNonVerifiedUsers');

const app = express();
 /* We are configuring cors to accept all incoming requests
 * If you want to limit this, you can look into "white listing" only certain domains
 *
 * docs: https://expressjs.com/en/resources/middleware/cors.html
 *
 */
app.use(corsMiddleWare());
app.use(loggerMiddleWare("dev"));
/**
 *
 * express.json():
 * be able to read request bodies of JSON requests
 * a.k.a. body-parser
 * Needed to be able to POST / PUT / PATCH
 *
 * docs: https://expressjs.com/en/api.html#express.json
 */

app.use(bodyParserMiddleWare);

if (process.env.DELAY) {
  app.use((req, res, next) => {
    setTimeout(() => next(), parseInt(process.env.DELAY));
  });
}
/**
 *
 * authMiddleware:
 *
 * When a token is provided:
 * decrypts a jsonwebtoken to find a userId
 * queries the database to find the user with that add id
 * adds it to the request object
 * user can be accessed as req.user when handling a request
 * req.user is a sequelize User model instance
 *
 * When no or an invalid token is provided:
 * returns a 4xx reponse with an error message
 *
 * check: auth/middleware.js
 *
 * For fine grained control, import this middleware in your routers
 * and use it for specific routes
 */

app.use(deleteNonVerifiedUsers)
app.use("/", authRouter);
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
