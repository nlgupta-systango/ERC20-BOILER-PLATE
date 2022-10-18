require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
const MNEMONIC = process.env.MNEMONIC;
const POLYGONSCANKEY = process.env.POLYGONSCANKEY;
const ETHERSCANKEY = process.env.ETHERSCANKEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
module.exports = {

  networks: {

    test: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

    goerli: {
      provider: () => {
        return new HDWalletProvider(MNEMONIC, 'wss://goerli.infura.io/ws/v3/' + INFURA_API_KEY)
      },
      network_id: 5, // eslint-disable-line camelcase
      timeoutBlocks: 200,
      skipDryRun: true,
    },

    mumbai: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://matic-mumbai.chainstacklabs.com/`
        ),
      network_id: 80001,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
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
      polygonscan: POLYGONSCANKEY,
      etherscan: ETHERSCANKEY
    }
  };


