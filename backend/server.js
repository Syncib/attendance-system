require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require ('cors');
const attendanceRoutes = require("./routes/attendanceRoutes");
const userRoutes = require('./routes/userRoutes')

const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/users',userRoutes)
app.use("/api/attendance", attendanceRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
