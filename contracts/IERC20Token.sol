// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/**
 * @dev Interface of the ERC20Token implementation.
 */

interface IERC20Token{

    /**
     * @dev Mint the ERC20 token to given address
     */
    function mint(address to, uint256 amount) external payable; 

    /**
     * @dev Owner can airdrop the ERC20 tokens to users
     */
    function airDrop(address to,uint256 amount) external;

    /**
     * @dev Withdraw all the ethers of contract to owner
     */
    function withdraw() external;

    /**
     * @dev Adds the account to blacklist
     */
    function addToBlackList(address blackListAddress) external;

    /**
     * @dev Removes the account from blacklist
     */
    function removeFromBlackList(address blackListAddress) external;

    /**
     * @dev update the token price 
     */
    function updateTokenPrice(uint256 _tokenPrice) external;

    /**
     * @dev Pause the contract
     */
    function pause() external;

    /**
     * @dev Unpause the contract
     */
    function unpause() external;
}
