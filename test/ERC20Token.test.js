const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const {
    constants, // Common constants, like the zero address and largest integers
    expectEvent, // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const ERC20Token = artifacts.require("ERC20Token");
let ERC20TokenInstance = null
contract("ERC20Token", (accounts) => {

    const EventNames = {
        Paused: "Paused",
        Unpaused: "Unpaused",
        AddedToBlackList: "AddedToBlackList",
        RemovedFromBlackList: "RemovedFromBlackList",
        ERC20Minted: "ERC20Minted",
        EthersWithdraw: "EthersWithdraw",
        TokenPriceUpdated: "TokenPriceUpdated",
        Transfer: "Transfer"
    };

    const NAME = process.env.NAME;
    const SYMBOL = process.env.SYMBOL;
    let TOKENPRICE = process.env.TOKENPRICE;
    const NEWTOKENPRICE = 2000;
    const FTDECIMALS = 18;
    const TOKENTOBEMINT = 10;
    const TOKENTOBEAIRDROP = 7;
    const ZEROADDRESS = constants.ZERO_ADDRESS;
    const ZEROBALANCE = "0";
    const [owner, minter, user, bob, blackListUser, toBeBlackListUser] = accounts;

    async function initContract() {
        ERC20TokenInstance = await ERC20Token.new(NAME, SYMBOL, TOKENPRICE, { from: owner });

    }

    before("Deploy ERC20Token Token Contract", async () => {
        await initContract();
    });

    describe("Initial State", () => {
        describe("when the ERC20Token contract is instantiated", function () {
            it("has a name", async function () {
                expect(await ERC20TokenInstance.name()).to.equal(NAME);
            });

            it("has a symbol", async function () {
                expect(await ERC20TokenInstance.symbol()).to.equal(SYMBOL);
            });

            it("has a ERC20 decimals", async function () {
                expect((await ERC20TokenInstance.decimals()).toString()).to.equal(FTDECIMALS.toString());
            });

            it("should create a new contract address", async () => {
                expect(ERC20TokenInstance.address);
            });

            it("should has TOKENPRICE", async () => {
                console.log((await ERC20TokenInstance.tokenPrice()).toString());
                expect((await ERC20TokenInstance.tokenPrice()).toString()).to.equal(TOKENPRICE.toString());
            });

        });
    });

    describe("mint", async () => {
        describe("when user tries to mint token", async () => {
            it("should mint token to user", async () => {
                const tokenReceipt = await ERC20TokenInstance.mint(minter, TOKENTOBEMINT, { from: minter, value: 12000 });
                expect((await ERC20TokenInstance.balanceOf(minter)).toString()).to.equal(TOKENTOBEMINT.toString());
                await expectEvent(tokenReceipt, EventNames.ERC20Minted, {
                    account: minter,
                    amount: (TOKENTOBEMINT).toString()
                });
            })

            it("should not mint token to user if user tries to mint token without paying required token price ", async () => {
                await expectRevert(
                    ERC20TokenInstance.mint(minter, TOKENTOBEMINT, { from: minter, value: 10 }),
                    "ERC20Token: Insufficient balance."
                );
            })

            it("should not mint token to Zero Address if user tries to mint token to Zero Address", async () => {
                await expectRevert(
                    ERC20TokenInstance.mint(ZEROADDRESS, TOKENTOBEMINT, { from: minter, value: 12000 }),
                    "ERC20Token: Cannot mint ERC20Token to Zero Address."
                );
            })

            it("should not mint token to user if blacklisted user tries to mint token", async () => {
                await ERC20TokenInstance.addToBlackList(blackListUser, { from: owner });
                await expectRevert(
                    ERC20TokenInstance.mint(blackListUser, TOKENTOBEMINT, { from: minter, value: 12000 }),
                    "ERC20Token: This address is in blacklist"
                );
            })
        })
    })

    describe("airDrop", async () => {
        describe("when owner tries to airdrop the token", async () => {
            it("should air drop the tokens", async () => {
                await ERC20TokenInstance.airDrop([bob, user], [TOKENTOBEAIRDROP, TOKENTOBEAIRDROP], { from: owner });
                expect((await ERC20TokenInstance.balanceOf(bob)).toString()).to.equal(TOKENTOBEAIRDROP.toString());
                expect((await ERC20TokenInstance.balanceOf(user)).toString()).to.equal(TOKENTOBEAIRDROP.toString());
            })

            it("should not airdrop token for incorrect parameter", async () => {
                await expectRevert(
                    ERC20TokenInstance.airDrop([user, blackListUser], [1], {
                        from: owner
                    }),
                    "ERC20Token: Incorrect parameter length"
                );
            });
        })

        describe("when non-owner tries to airdrop the token", async () => {
            it("should not air drop the tokens", async () => {
                await expectRevert(
                    ERC20TokenInstance.airDrop([user], [TOKENTOBEMINT], { from: user }),
                    "Ownable: caller is not the owner"
                );
            })
        })
    })

    describe("withdraw", async () => {
        describe("when owner tries to withdraw the contract balance", async () => {
            it("should withdraw the ethers from contract to owner", async () => {
                const withdrawRecipt = await ERC20TokenInstance.withdraw({ from: owner })
                expect((await ERC20TokenInstance.getContractBalance()).toString()).to.equal(ZEROBALANCE.toString());
                await expectEvent(withdrawRecipt, EventNames.EthersWithdraw, {
                    account: owner
                });
            })

            it("should not withdraw the ethers from contract to owner if contract have zero balance", async () => {
                await expectRevert(
                    ERC20TokenInstance.withdraw({ from: owner }),
                    "ERC20Token: Insufficient balance"
                );
            })
        })

        describe("when non-owner tries to withdraw the contract balance", async () => {
            it("should not withdraw the contract balance", async () => {
                await expectRevert(
                    ERC20TokenInstance.withdraw({ from: user }),
                    "Ownable: caller is not the owner"
                );
            })
        })
    })

    describe("addToBlackList", async () => {
        describe("when owner tries to blacklist address", async () => {
            it("should add an address to blacklist", async () => {
                const addBlacklistReceipt = await ERC20TokenInstance.addToBlackList(
                    toBeBlackListUser,
                    { from: owner }
                );
                await expectEvent(addBlacklistReceipt, EventNames.AddedToBlackList, {
                    _user: toBeBlackListUser,
                });
            });

            it("should not add blacklisted address again into blacklist address", async () => {
                await expectRevert(
                    ERC20TokenInstance.addToBlackList(toBeBlackListUser, { from: owner }),
                    "ERC20Token: given blackListAddress is already blacklisted"
                );
            });

            it("should not blacklist zero address", async () => {
                await expectRevert(
                    ERC20TokenInstance.addToBlackList(ZEROADDRESS, { from: owner }),
                    "ERC20Token: blackListAddress can not be Zero Address."
                );
            })
        });

        describe("when user tries to blacklist address", async () => {
            it("should not add user tries to blacklist address ", async () => {
                await expectRevert(
                    ERC20TokenInstance.addToBlackList(bob, {
                        from: user,
                    }),
                    "Ownable: caller is not the owner"
                );
            })
        });
    });

    describe("removeFromBlackList", () => {
        describe("when other user tries to remove blacklist address", function () {
            it("should not remove an address from blacklist", async () => {
                await expectRevert(
                    ERC20TokenInstance.removeFromBlackList(toBeBlackListUser, {
                        from: bob,
                    }),
                    "Ownable: caller is not the owner"
                );
            });
        });

        describe("when owner tries to remove blacklist address", function () {
            it("should remove an address from blacklist", async () => {
                const removeBlacklistReceipt = await ERC20TokenInstance.removeFromBlackList(toBeBlackListUser, { from: owner });
                await expectEvent(
                    removeBlacklistReceipt,
                    EventNames.RemovedFromBlackList,
                    {
                        _user: toBeBlackListUser,
                    }
                );
            });

            it("should not remove the non-blacklisted address from blacklist", async () => {
                await expectRevert(
                    ERC20TokenInstance.removeFromBlackList(toBeBlackListUser, { from: owner }),
                    "ERC20Token: given blackListAddress is not in blacklist"
                );
            });
        });
    });

    describe("updateTokenPrice", async () => {
        describe("when owner tries to update the token price", async () => {
            it("should update the token price", async () => {
                expect((await ERC20TokenInstance.tokenPrice()).toString()).to.equal(TOKENPRICE.toString());
                const tokenPriceReceipt = await ERC20TokenInstance.updateTokenPrice(NEWTOKENPRICE, { from: owner })
                expect((await ERC20TokenInstance.tokenPrice()).toString()).to.equal(NEWTOKENPRICE.toString());
                await expectEvent(tokenPriceReceipt, EventNames.TokenPriceUpdated, {
                    amount: (NEWTOKENPRICE).toString(),
                });
            })

            it("should not update the token price if given token price is equal to current token price", async () => {
                previousTokenPrice = await ERC20TokenInstance.tokenPrice();
                await expectRevert(
                    ERC20TokenInstance.updateTokenPrice(previousTokenPrice, { from: owner }),
                    "ERC20Token: newTokenPrice is can not be same as current tokenPrice."
                );
            })
        })

        describe("when other user tries to update the token price", function () {
            it("should not update the token price", async () => {
                await expectRevert(
                    ERC20TokenInstance.updateTokenPrice(TOKENPRICE, {
                        from: bob,
                    }),
                    "Ownable: caller is not the owner"
                );
            });
        });
    })

    describe("getContractBalance", async () => {
        describe("when users tries to get the contract balance", async () => {
            it("should return the contract balance", async () => {
                contractBalance = await web3.eth.getBalance(ERC20TokenInstance.address)
                expect((await ERC20TokenInstance.getContractBalance()).toString()).to.equal(contractBalance.toString());
            })
        })
    })

    describe("pause", async () => {

        describe("when other user tries to pause contract", function () {
            it("should not pause contract", async () => {

                expect(await ERC20TokenInstance.paused()).to.equal(false);

                await expectRevert(
                    ERC20TokenInstance.pause({
                        from: user,
                    }),
                    "Ownable: caller is not the owner"
                );
            });
        });

        describe("when owner tries to pause contract", function () {
            it("should pause contract", async () => {
                expect(await ERC20TokenInstance.paused()).to.equal(false);
                const pauseReceipt = await ERC20TokenInstance.pause({
                    from: owner,
                });
                await expectEvent(pauseReceipt, EventNames.Paused, {
                    account: owner,
                });
                expect(await ERC20TokenInstance.paused()).to.equal(true);
            });
        });

        describe("when contract is paused", function () {
            it("should not add user to black list", async function () {
                expect(await ERC20TokenInstance.paused()).to.equal(true);
                await expectRevert(
                    ERC20TokenInstance.addToBlackList(blackListUser, { from: owner }),
                    "Pausable: paused"
                );
            });
            it("should not remove user from black list", async function () {
                expect(await ERC20TokenInstance.paused()).to.equal(true);
                await expectRevert(
                    ERC20TokenInstance.removeFromBlackList(blackListUser, { from: owner }),
                    "Pausable: paused"
                );
            });
            it("should not mint ERC20 token", async () => {
                expect(await ERC20TokenInstance.paused()).to.equal(true);
                await expectRevert(
                    ERC20TokenInstance.mint(bob, TOKENTOBEMINT, {
                        from: bob, value: 1
                    }),
                    "Pausable: paused"
                );
            });

            it("should not airdrop ERC20 token", async () => {
                await expectRevert(
                    ERC20TokenInstance.airDrop([bob], [1], {
                        from: owner
                    }),
                    "Pausable: paused"
                );
            });

        });
    });

    describe("unpause", () => {

        describe("when other user tries to unpause contract", function () {
            it("should not unpause contract", async () => {
                expect(await ERC20TokenInstance.paused()).to.equal(true);
                await expectRevert(
                    ERC20TokenInstance.unpause({
                        from: user,
                    }),
                    "Ownable: caller is not the owner"
                );
            });
        });

        describe("when owner tries to unpause contract", function () {
            it("should unpause contract", async () => {
                expect(await ERC20TokenInstance.paused()).to.equal(true);
                const unpauseReceipt = await ERC20TokenInstance.unpause({
                    from: owner,
                });
                await expectEvent(unpauseReceipt, EventNames.Unpaused, {
                    account: owner,
                });
                expect(await ERC20TokenInstance.paused()).to.equal(false);
            });
        });
    });
});

after(() => {
    ERC20TokenInstance = null;
});
