require("module-alias/register");
const express = require("express");
const session = require("express-session");
const { db } = require("./config.js");
const redis = require("redis");
const cors = require("cors");
const { RedisStore} = require("connect-redis");
const https = require("https");
const fs = require("fs");


const authRoutes = require("./routes/auth.route.js");
const cartRoutes = require("./routes/cart.route.js");
const productRoutes = require("./routes/product.route.js");
const categoryRoute = require("./routes/category.route.js");
const wishListRoutes = require("./routes/wishlist.route.js");
const userRoute = require("./routes/user.route.js");
const paymentRoutes = require("./routes/payment.route.js");


const { client } = require("./misc.js");
require("dotenv").config();
const sslOptions = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert")
};


const app = express();
app.use(express.json());

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect().then(() => console.log("✅ Connected to Redis"));

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      client,
      "http://192.168.43.103",
      "http://localhost:5173",
      "http://127.0.0.1"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["set-cookie"]
};

app.use(cors(corsOptions));

const isProduction = true;//process.env.NODE_ENV === "production";
const cookie = {
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  httpOnly: true,
  domain: undefined, //isProduction ? ".shopam.store" : undefined,
  path: "/",
  maxAge: 86400000, // 24h
};
const secret = process.env.SESSION_SECRET || "session_secret_random";

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    name: "_shop_am-session-id_",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: cookie,
    proxy: true,
    rolling: true,
  })
);

/*app.use((req, res, next) => {
  console.log(req.session);
  next();
});*/

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/pay", paymentRoutes);


app.get("/server-view", (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`You visited this page ${req.session.views} times`);
});
app.get("/api/notify", (req, res) => {
  const data = req.session.notification;
  delete req.session.notification;
  res.json(data || {});
});


async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Successfully connected to MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error.message);
  }
}

testConnection();


process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception: ", error);
})
process.on("unhandledRejection", (det) => {
  console.log("Unhandled Rejection: ", det)
});


const PORT = 3000;
const LISTEN = () => console.log("App is Running on port " + PORT);
https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", LISTEN);
