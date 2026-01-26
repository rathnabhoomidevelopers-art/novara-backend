require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoclient = require("mongodb").MongoClient;
const app = express();
const connectionString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/contact", (req, res) => {
  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    inquiry_project: req.body.inquiry_project,
    know_us: req.body.know_us,
    message: req.body.message,
    agreeToTerms: req.body.agreeToTerms,
  };
  mongoclient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("ecovara");
    database
      .collection("contact")
      .insertOne(user)
      .then(() => {
        res.send("Thank You, Our team will reach you soon!.");
        res.end();
      });
  });
});

app.post("/inquiry", (req, res) => {
  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    agreeToTerms: req.body.agreeToTerms,
  };
  mongoclient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("ecovara");
    database
      .collection("inquiry")
      .insertOne(user)
      .then(() => {
        res.send("Thank You, Our team will reach you soon!.");
        res.end();
      });
  });
});

app.post("/pop-up", (req, res) => {
  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    email: req.body.email,
    message: req.body.message,
  };
  mongoclient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("ecovara");
    database
      .collection("pop-up")
      .insertOne(user)
      .then(() => {
        res.send("Thank You, Our team will reach you soon!.");
        res.end();
      });
  });
});

app.post("/blogs", (req, res) => {
  var user = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    agreeToTerms: req.body.agreeToTerms,
  };
  mongoclient.connect(connectionString).then((clientObj) => {
    var database = clientObj.db("ecovara");
    database
      .collection("blogs")
      .insertOne(user)
      .then(() => {
        res.send("Thank You, Our team will reach you soon!.");
        res.end();
      });
  });
});

app.listen(3001);
console.log(`Server running http://127.0.0.1:3001`);