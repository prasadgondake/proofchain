const express = require("express");
const app = express();
const path = require("path");
const port = 4000 || process.env.PORT;
const Web3 = require("web3");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const bodyParser = require("body-parser");
const Utility = require("./utility");
// const algorithm = 'aes-256-ctr';
// let key = "MySecretKey";

const truffle_connect = require("./connection/app.js");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public_static"));

const fileFilter = (req, file, cb) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("image", 20)
);
app.use(express.static(path.join(__dirname, "public_static")));

app.get("/", (req, res, next) => {
  res.render("main", {
    path: "/",
    pageTitle: "HOME",
  });
});
app.get("/submit", (req, res, next) => {
  res.render("submit", {
    path: "/submit",
    done: 0,
    success: 0,
    pageTitle: "submit",
    address: "",
    hash: "",
  });
});

app.post("/direct", (req, res, next) => {
  const hash = req.body.hash;
  const address = req.body.address;
  res.render("contract", {
    path: "/contract",
    success: 1,
    address: address,
    hash: hash,
    pageTitle: "contract",
  });
});
app.get("/contract", (req, res, next) => {
  res.render("contract", {
    path: "/contract",
    success: 1,
    address: "",
    hash: "",
    pageTitle: "contract",
  });
});
app.get("/about", (req, res, next) => {
  res.render("about", {
    path: "/About",
    pageTitle: "About",
  });
});
app.post("/submit", (req, res, next) => {
  const imageFiles = req.files;
  // console.log(imageFiles);
  const address = req.body.address;
  console.log("/submit : ", address);
  const array = [];
  // console.log(imageFiles[0]);
  let hashValue = [];
  let unitHash;
  for (let i = 0; i < imageFiles.length; i++) {
    fileName = imageFiles[i].originalname;
    array.push(fileName);
    unitHash = Utility.sha256Converter(fileName);
    hashValue.push(unitHash);
  }
  let newHash = unitHash;
  if (hashValue.length > 1) {
    let textHash = hashValue[0] + " " + hashValue[1];
    newHash = Utility.sha256Merger(textHash);
    for (let j = 2; j < hashValue.length; j++) {
      newHash = Utility.sha256Merger(newHash + " " + hashValue[j]);
    }
  }
  console.log("HASH: ", newHash);
  const crimeDescription = req.body.crimeDescription;
  truffle_connect.createEvent(
    newHash,
    crimeDescription,
    address,
    array.toString(),
    (value) => {
      res.render("submit", {
        path: "/submit",
        pageTitle: "submit",
        done: 1,
        address: address,
        success: Number(value),
        hash: newHash,
      });
    }
  );
});

app.post("/transferEvent", (req, res, next) => {
  const newAddress = req.body.newAddress;
  const address = req.body.address;
  const hashValue = req.body.hash;
  console.log("newAddress", newAddress);
  console.log("current  ", address);
  console.log("hashValue is", hashValue);
  truffle_connect.transferEvent(hashValue, address, newAddress, (value) => {
    res.render("transfer", {
      path: "/transfer",
      result: value,
      pageTitle: "Other Utility",
    });
  });
});
app.post("/removeEvent", (req, res, next) => {
  const hashValue = req.body.hash;
  const address = req.body.address;
  console.log("hashValue is", hashValue);
  truffle_connect.removeEvent(hashValue, address, (value) => {
    res.render("remove", {
      path: "/remove",
      hash: hashValue,
      result: value,
      pageTitle: "Remove",
    });
  });
});
app.post("/getEvent", (req, res, next) => {
  const hashValue = req.body.hash;
  const address = req.body.address;
  console.log("hashValue in GetEvent is: ", hashValue);
  truffle_connect.getEvent(hashValue, address, (value) => {
    res.render("details", {
      path: "/details",
      hash: hashValue,
      success: value.ans,
      result: value.result,
      pageTitle: "Evidence Detail",
    });
  });
});

app.listen(port, () => {
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );

  console.log("Express Listening at http://localhost:" + port);
});
