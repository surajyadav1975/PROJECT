const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const  {DBConnection} = require("./DB/mongoose.js");
const cookieParser = require('cookie-parser');
const router = require("./routes/Routes.js");

dotenv.config();

const app=express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

DBConnection();


app.use("/",router);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});