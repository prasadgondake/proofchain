const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "images/", "img.jpg");

// Use stat() method
let P = 0;
fs.stat(p, (err, stats) => {
  if (!err) {
    P = 1;
  } else {
    P = 0;
  }
});
console.log(Number(P));
if (Number(p)) {
  console.log("Did It");
} else {
  console.log("Failed");
}

// const sha256Converter = (fileName) => {
//   console.log(path.join(__dirname, "images/", fileName));
//   const exist = fs.stat(
//     path.join(__dirname, "images/", fileName),
//     (err, stats) => {
//       if (!err) {
//         if (stats.isFile()) {
//           return true;
//         }
//       } else {
//         return false;
//       }
//     }
//   );
//   console.log(exist);
//   if (exist) {
//     let fileBuffer = fs.readFileSync(path.join(__dirname, "images/", fileName));
//     const hash = crypto.createHash("sha256");

//     // console.log("sha  ", __dirname, "images/", fileName);
//     return "0x" + hash.update(fileBuffer).digest("hex");
//   } else {
//     const hash = crypto.createHash("sha256").update("0").digest("hex");
//     return "0x" + hash;
//   }
// };

// console.log(sha256Converter("img.jpg"));
