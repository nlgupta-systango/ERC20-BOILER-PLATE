require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.MNEMONIC;
const KEY = process.env.KEY;
module.exports = {

  networks: {

    test: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

    mumbai: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://matic-mumbai.chainstacklabs.com/`
        ),
      network_id: 80001,
      timeoutBlocks: 200,
      skipDryRun: true,
    },

    compilers: {
      solc: {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    },

    mocha: {
      enableTimeouts: false,
      before_timeout: 300000
    },

    plugins: [
      "solidity-coverage",
      "truffle-plugin-verify"
    ],

    api_keys: {
      polygonscan: KEY
    }
  }
};

