const contract = require("truffle-contract");

const COC_artifact = require("../build/contracts/ChainOfCustody.json");

var COC = contract(COC_artifact);

const Utility = require("../utility");

module.exports = {
  createEvent: function (hashval, desc, address, str, cb) {
    var self = this;
    // Bootstrap the MetaCoin abstraction for Use.
    COC.setProvider(self.web3.currentProvider);
    var coc;
    console.log("create event ", address);
    COC.deployed()
      .then(function (instance) {
        coc = instance;

        return coc.CreateEvidence(hashval, desc, str, {
          from: address,
          gas: 1000000,
        });
      })
      .then(function (value) {
        console.log("Done");
        cb(1);
        // callback(value.valueOf());
        console.log("-----------***Created***______________");
        // console.log();
        console.log("-----------*********______________");
      })
      .catch(function (e) {
        console.log("Not Done");
        cb(0);
      });
  },
  transferEvent: function (hashval, sender, receiver, cb) {
    var self = this;
    // Bootstrap the MetaCoin abstraction for Use.
    COC.setProvider(self.web3.currentProvider);
    var coc;
    console.log("sender address is ", sender);
    console.log("receiver address is ", receiver);
    COC.deployed()
      .then(function (instance) {
        coc = instance;
        return coc.GetEvidence.call(hashval, {
          from: sender,
          gas: 1000000,
        });
      })
      .then((value) => {
        const array = value.valueOf()[6].split(",");
        console.log(array);
        console.log("Files in the folder: ", array.toString());
        const owner = value.valueOf()[1];
        console.log("Current Owner: in Converter : ", owner);
        let mergerHash = [];
        for (let i = 0; i < array.length; i++) {
          fileName = array[i];
          unitHash = Utility.sha256Converter(fileName);
          mergerHash.push(unitHash);
        }
        let newHash = unitHash;

        if (mergerHash.length > 1) {
          let textHash = mergerHash[0] + " " + mergerHash[1];
          newHash = Utility.sha256Merger(textHash);
          for (let j = 2; j < mergerHash.length; j++) {
            newHash = Utility.sha256Merger(newHash + " " + mergerHash[j]);
          }
        }
        console.log("Given Hash Value  :  ", hashval);
        console.log("New Hash Value:  ", newHash);
        if (newHash.toString() != hashval.toString()) {
          console.log(
            `The Data has been Changed When the Owner was : ${owner}`
          );
          cb({
            msg: `The Data has been Changed When the Owner was : ${owner}`,
            sender: sender,
            receiver: receiver,
            newHash: newHash,
            oldHash: hashval,
            items: array,
            status: 1,
          });
        } else {
          COC.deployed().then(function (instance) {
            coc = instance;
            return coc
              .Transfer(hashval, receiver, {
                from: sender,
                gas: 1000000,
              })
              .then(function (value) {
                // callback(value.valueOf());
                console.log("-----------*********______________");
                // console.log(value);
                cb({
                  msg: `The Data has been Transferred Successfully.`,
                  sender: sender,
                  receiver: receiver,
                  newHash: newHash,
                  oldHash: hashval,
                  items: array,
                  status: 1,
                });
                console.log("-----------*********______________");
              })
              .catch(function (e) {
                console.log(e);
                cb({
                  msg: `Something Error Has Occurred.`,
                  sender: "",
                  receiver: "",
                  newHash: "",
                  oldHash: "",
                  items: [],
                  status: 0,
                });
              });
          });
        }
      })
      .catch(function (e) {
        console.log(e);
        cb({
          msg: `Something Error Has Occurred.`,
          sender: "",
          receiver: "",
          newHash: "",
          oldHash: "",
          items: [],
          status: 0,
        });
      });
  },
  removeEvent: function (hashval, address, cb) {
    var self = this;
    // Bootstrap the MetaCoin abstraction for Use.
    COC.setProvider(self.web3.currentProvider);
    var coc;
    COC.deployed()
      .then(function (instance) {
        coc = instance;
        return coc.RemoveEvidence(hashval, {
          from: address,
          gas: 1000000,
        });
      })
      .then(function (value) {
        // callback(value.valueOf());
        console.log("-----------***remove****______________");
        cb({
          sender: address,
          status: 1,
        });
        console.log("-----------****remove***______________");
      })
      .catch(function (e) {
        // console.log(e);
        cb({
          sender: address,
          status: 0,
        });
      });
  },

  getEvent: function (hashval, address, cb) {
    var self = this;
    COC.setProvider(self.web3.currentProvider);
    var coc;
    COC.deployed()
      .then(function (instance) {
        coc = instance;
        return coc.GetEvidence.call(hashval, {
          // from: address,
          gas: 1000000,
        });
      })
      .then(function (value) {
        // callback(value.valueOf());
        console.log("-----------***Get****______________");
        console.log(value.valueOf());
        // console.log(value);
        cb({ result: value.valueOf(), ans: 1 });
        console.log("-----------****Get***______________");
      })
      .catch(function (e) {
        // console.log(e);
        let r = value.valueOf();
        r[6] = "No Files Are Found";
        cb({ result: r, ans: 0 });
      });
  },
};
