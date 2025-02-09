// Load environment variables
require("dotenv").config();

const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow frontend API calls
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "moffat_baylodge"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// Serve HTML Pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../frontend/index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "../frontend/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "../frontend/register.html")));

// API: User Registration
app.post("/api/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, hash], (error, results) => {
            if (error) return res.status(500).json({ error: "Database error" });
            res.json({ message: "User registered successfully" });
        });
    });
});

// API: User Login
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (error, results) => {
        if (error) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "User not found" });

        // Compare password
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error comparing passwords" });
            if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

            res.json({ message: "Login successful" });
        });
    });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
