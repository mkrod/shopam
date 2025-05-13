const { createPool } = require("mysql2");
require("dotenv");


const db = createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "shopam",
    connectionLimit: 20,
    queueLimit: 5,
}).promise();


module.exports = { db }