var ChainOfCustody = artifacts.require("../contracts/ChainOfCustody.sol");

module.exports = function (deployer) {
  deployer.deploy(ChainOfCustody);
};
