# ERC20-BOILER-PLATE Contract
Contract for ERC20 Token Contract

## Getting started

To make it easy for you to get started with Github, here's a list of recommended next steps.

## Table of Contents ##
1. [Setup](#setup)
2. [Commands](#commands)
3. [Contract Compile](#contract-compile)
4. [Deploy On Local Network](#deploy-on-local-network)

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


 