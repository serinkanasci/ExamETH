const Bank = artifacts.require("Bank");
const ERC20 = artifacts.require("ERC20");

module.exports = function (deployer) {
  deployer.deploy(Bank);
  deployer.deploy(ERC20);
};
