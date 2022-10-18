# ERC20-BOILER-PLATE Contract
Contract for ERC20 Token Contract

## Getting started

To make it easy for you to get started with Github, here's a list of recommended next steps.

## Table of Contents ##
1. [Setup](#setup)
2. [Commands](#commands)
3. [Contract Compile](#contract-compile)
4. [Truffle Config file](#truffle-config-file)
5. [Deploy On Local Network](#deploy-on-local-network)
6. [Deploy On Testnet Network](#deploy-on-testnet-network)

## Setup

1. System Setup 

You'll need node, npm and the Truffle Suite to set up the development environment. 

- [Node](https://nodejs.org/en/)
    - Version - 16.13.0
- [Truffle Suite](https://www.trufflesuite.com/)
    - Version - 5.5.3
- [Ganache](https://www.npmjs.com/package/ganache-cli)
    - Version - Ganache CLI v6.12.2 (ganache-core: 2.13.2)


2. .env Sample

```cmd
NAME=<Place your ERC20 Token Name here>
SYMBOL=<Place your ERC20 Token Symbol here>
TOKENPRICE=<Place your ERC20 Token Price here>
MNEMONIC=<Place your Ethereum address seed phrase here>
POLYGONSCANKEY=<Place your POLYGONSCAN API KEY>
ETHERSCANKEY=<Place your ETHERSCAN API KEY>
INFURA_API_KEY=<Place your Infura API KEY>
```

## Commands

1. To install truffle 
 ```console
     npm install -g truffle
 ```
2. To install ganache cli
 ```console
     npm install -g ganache-cli
```
3. To install the required dependencies for project
 ```console
     npm install 
 ```
 
## Contract Compile

  ```console
    truffle compile --all
  ```

## Truffle Config File

This file would use your Mnemonic key and PolygonScan API KEY to deploy the smart contracts on local network as well Polygon and Test Network. 
These values will be picked up either from .env file explained above or the environment variables of the host system.

```js
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

```


## Deploy On Local Network

Network Name - test

- To run smart contract on test first start

    `ganache-cli`

    in another terminal

- To migrate the contracts 

    `truffle migrate --reset --network test`

    - This will use the migrations/2_migrate_ERC20.js file and deploy the ERC20Token contract.

    - This file would use your NAME, SYMBOL and TOKENPRICE fields from .env file and pass to the smart contract.

- To test the contracts 

    `truffle test --network test`

    - This will use the test/ERC20Token.test.js file and test the ERC20Token contract.

## Deploy On Testnet Network

Network Name - mumbai

- To migrate the contracts 

    `truffle migrate --network mumbai`

    - This will use the migrations/2_migrate_ERC20.js file and deploy the RolaCoaster contract.

        This file would use your NAME, SYMBOL and TOKENPRICE  fields from .env file and pass to the smart contract.

Network Name - goerli

- To migrate the contracts 

    `truffle migrate --network goerli`

    - This will use the migrations/2_migrate_ERC20.js file and deploy the RolaCoaster contract.

        This file would use your NAME, SYMBOL and TOKENPRICE  fields from .env file and pass to the smart contract.
    
## Test Case Coverage

To run the unit test case coverage on the smart contract we have used solidity-coverage npm package. The command to run the test coverage is:

`truffle run coverage`


File              |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------|----------|----------|----------|----------|----------------|
 contracts/       |      100 |    90.91 |      100 |      100 |                |
  BlackList.sol   |      100 |      100 |      100 |      100 |                |
  ERC20Token.sol  |      100 |       90 |      100 |      100 |                |
  IERC20Token.sol |      100 |      100 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
All files         |      100 |    90.91 |      100 |      100 |                |



## Surya graph report

Surya is an utility tool for smart contract systems. It provides a number of visual outputs and information about the contracts' structure. Also supports querying the function call graph in multiple ways to aid in the manual inspection of contracts.

- Graph of ERC20Token contract
<img src="./surya_report.svg">

- Graph of Inheritance report

<img src="./surya_inheritance_report.svg">
