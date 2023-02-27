const config = require("config");
const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);

const appController = require("./controllers/AppController");
// const isAuth = require("./middleware/isAuth");

const connectDB = require("./config/db");

const MONGO_DB_URL = config.get("MONGO_DB_URL");
const SERVER_PORT = config.get("SERVER_PORT");

const app = express();

connectDB();

/**
 * @description: session store.
 */
const store = new mongodbStore({
  uri: MONGO_DB_URL,
  collection: "sessions",
});

/**
 * @description: disable etag header, to prevent 304 response code.
 */
app.disable("etag");

/**
 * @description: set view engine.
 */
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

/**
 * @description: session middleware.
 */
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

/**
 * @description: start server.
 */
app.listen(SERVER_PORT, () => {
  console.log(`Server is Running on Port ${SERVER_PORT}`);
});

/**
 * @description: Landing Page.
 */
app.get("/", appController.landing_page);

/**
 * @description: Login Page.
 */
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// app.get("/", (req, res) => {
//   req.session.isAuth = true;

//   console.log(req.session);

//   console.log(`session id: ${req.session.id}`);

//   res.status(200).send({
//     status: "success",
//     message: "server is running",
//   });
// });
