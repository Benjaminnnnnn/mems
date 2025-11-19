require("dotenv").config();
const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y8xss1e.mongodb.net/?appName=Cluster0`;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes); // => /api/places/
app.use("/api/users", usersRoutes); // => /api/users

// handling unsupported routes
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

// handling errors
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown erorr occured" });
});

app.use(usersRoutes);

mongoose.set("strictQuery", false);
mongoose
  .connect(DB_URI, { dbName: "places" })
  .then(() => {
    console.log("Server listening...");
    const PORT = process.env.port || 8080;
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err)
    console.log("Database connection failed.");
  });
