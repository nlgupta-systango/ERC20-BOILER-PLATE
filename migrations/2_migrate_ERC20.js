const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const ERC20Token = artifacts.require("ERC20Token");
const NAME = process.env.NAME;
const SYMBOL = process.env.SYMBOL;
const TOKENPRICE = process.env.TOKENPRICE
module.exports = function (deployer) {
  deployer.deploy(ERC20Token, NAME, SYMBOL, TOKENPRICE);
};
