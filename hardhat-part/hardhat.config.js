require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:".env"});

/** @type import('hardhat/config').HardhatUserConfig */

const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
module.exports = {
  solidity: "0.8.9",
  networks:{
    mumbai:{
      url: ALCHEMY_API_KEY,
      accounts:[MUMBAI_PRIVATE_KEY]
    },
  },
};
