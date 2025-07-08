const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const  {DBConnection} = require("./DB/mongoose.js");
const cookieParser = require('cookie-parser');
const router = require("./routes/Routes.js");
const { setupSocket } = require('./socket.js');
const http = require('http');
dotenv.config();

const app=express();
const server = http.createServer(app); 
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

DBConnection();

app.use("/",router);
// console.log(server);
setupSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});