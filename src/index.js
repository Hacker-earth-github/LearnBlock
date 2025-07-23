require('dotenv').config();

// Import dependencies
const express = require("express");
const Session = require('express-session');
const router = require("./routes");

// Create an app
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(
  Session({
    name: 'siwe-quickstart',
    secret: 'siwe-quickstart-secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true },
  })
);

app.use(router);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
