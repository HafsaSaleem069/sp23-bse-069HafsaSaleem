const express = require("express");
const server = express();
const cors = require('cors');
let session = require("express-session");
const mongoose = require("mongoose");

//connecting to database server
mongoose
    .connect("mongodb://localhost:27017/MealTracker")
    .then(() => console.log("Connected to Mongo ...."))
    .catch((error) => console.log(error.message));

//using Sessions:
server.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
   
}));
server.set("view engine", "ejs");
// Serve static files from the 'public' directory
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(express.json());
server.use(cors());

const homeRoutes = require('./routes/home'); // Path to home.js
const adminRoutes = require('./routes/admin'); // Path to admin.js

// Use the routes
server.use('/home', homeRoutes); // Home route mounted at "/"
server.use('/admin', adminRoutes); // Admin route mounted at "/admin"

// Root Route
server.get('/', (req, res) => {
    res.send("Server is running"); // Default route
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});




