const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
exports.sha256Converter = (fileName) => {
  // const exist = fs.stat(
  //   path.join(__dirname, "images/", fileName),
  //   (err, stats) => {
  //     if (!err) {
  //       if (stats.isFile()) {
  //         return true;
  //       }
  //     } else {
  //       return false;
  //     }
  //   }
  // );
  let fileBuffer = fs.readFileSync(path.join(__dirname, "images/", fileName));
  const hash = crypto.createHash("sha256");
  // console.log("sha  ", __dirname, "images/", fileName);
  return "0x" + hash.update(fileBuffer).digest("hex");
};

exports.sha256Merger = (fileName) => {
  const hash = crypto.createHash("sha256").update(fileName).digest("hex");
  return "0x" + hash;
};
