require("module-alias/register");
const express = require("express");
const session = require("express-session");
const { db } = require("./config.js");
const redis = require("redis");
const cors = require("cors");
const { RedisStore} = require("connect-redis");
const https = require("https");
const fs = require("fs");
const { Server } = require("socket.io");


const authRoutes = require("./routes/auth.route.js");
const cartRoutes = require("./routes/cart.route.js");
const productRoutes = require("./routes/product.route.js");
const categoryRoute = require("./routes/category.route.js");
const wishListRoutes = require("./routes/wishlist.route.js");
const userRoute = require("./routes/user.route.js");
const paymentRoutes = require("./routes/payment.route.js");
const deployRoutes = require("./routes/deploy.route.js");


//const { client } = require("./misc.js");
//const path = require("path");
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

const allowedOrigins = process.env.CLIENT ? [process.env.CLIENT] : [
  "http://192.168.43.104",
  "http://192.168.43.104:5173",
  "http://127.0.0.1"
];

const corsOptions = {
  origin: function (origin, callback) {
     allowedOrigins;
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
    store: new RedisStore({ client: redisClient, prefix: 'app1:sess:' }),
    name: "_shop_am-session-id_",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: cookie,
    proxy: true,
    rolling: true,
  })
);

const server = https.createServer(sslOptions, app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

const ws_clients = new Map();

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("register_client", ({ user_id }) => {
    const id = socket.id
    ws_clients.set(user_id, id);
    console.log("Connected users: ", ws_clients);
  })

  socket.on("send_message", (data) => {
    console.log("📩 Message received:", data);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    for(const [user, id] of ws_clients.entries()){
      if(id === socket.id){
        ws_clients.delete(user);
        console.log("❌ Socket disconnected:", socket.id);
        break;
      }
    }
  });
});

app.set('trust proxy', 1);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/pay", paymentRoutes);
app.use("/deploy", deployRoutes);


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
//server.listen(PORT, "0.0.0.0", LISTEN);
app.listen(PORT, "0.0.0.0", LISTEN);