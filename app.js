// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// import middleware

const {isAuthenticated} = require("./middleware/jwt.middleware")

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const backstoryRoutes = require("./routes/backstory.routes")
app.use("/backstory"/* , isAuthenticated */ ,backstoryRoutes)

const authRoutes = require("./routes/auth.routes")
app.use("/auth", authRoutes)

const userRoutes = require("./routes/user.routes")
app.use("/user", userRoutes)

const characterRoutes = require("./routes/character.routes")
app.use("/character", characterRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
