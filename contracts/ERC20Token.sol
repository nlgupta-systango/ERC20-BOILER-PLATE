// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/**
* @title A ERC20Token contract
* @author Systango team
* @notice Serves as a fungible token
* @dev Inherits the OpenZepplin ERC20 implentation
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IERC20Token.sol";
import "./BlackList.sol";

contract ERC20Token is ERC20, Pausable, Ownable, IERC20Token, BlackList{
    
    /**
        @notice Price of ERC20 Token
     */
    uint256 public tokenPrice;

    // Zero Address
    address constant ZERO_ADDRESS = address(0);

    /**
     * @dev Sets the values for {name}, {symbol} and {_tokenPrice}
     * @custom:info The default value of {decimals} is 18
     * @custom:info name and symbol values are immutable: they can only be set once during construction
     */
    constructor(string memory name, string memory symbol,uint256 _tokenPrice) 
        ERC20(name, symbol) 
    {
        tokenPrice = _tokenPrice;
    }

    /**
    * @dev This is the mint function. It is used for minting `amount` ERC20 tokens to the `to` address
    * @dev Only non-blacklisted user can call this function
    * @param to The address to be token minted
    * @param amount Number of the ERC20 tokens to be minted
    */
    function mint(address to, uint256 amount) external payable override whenNotPaused whenNotBlackListedUser(msg.sender) whenNotBlackListedUser(to) {
        require(to != ZERO_ADDRESS, "ERC20Token: Cannot mint ERC20Token to Zero Address.");
        require(msg.value >= tokenPrice * amount,"ERC20Token: Insufficient balance.");
        _mint(to, amount);
    }

    /**
    * @notice airDrop is use to put the ERC20 tokens to given address
    * @dev This is the airDrop function. It is used by the owner to airdrop `amount` number of ERC20 tokens to the `to` address respectively.
    * @dev Only the owner can call this function
    * @param to The address to be airdropped
    * @param amount The amount of random tokens to be air dropped respectively
    */
    function airDrop(address to, uint256 amount) external override onlyOwner whenNotPaused{
        require(to != ZERO_ADDRESS, "ERC20Token: Cannot airDrop ERC20Token to Zero Address.");
        _mint(to, amount);
    }

    /**
    * @notice withdraw is use to take out all the contract balance into owner account
    * @dev This function would withdraw all the contract balance into owner's address
    * @dev Only the owner can call this function
    */
    function withdraw() external override onlyOwner {
        require(getContractBalance() > 0, "ERC20Token: Insufficient balance");
        address payable _to = payable(msg.sender);
        bool sent = _to.send(getContractBalance());
        require(sent, "Failed to send Ether");
    }

    /**
    * @notice addToBlackList is use to add the address into blacklist
    * @dev This function would add an address to the blacklist mapping
    * @dev Only the owner can call this function
    * @param blackListAddress The account to be added to blacklist
    */
    function addToBlackList(address blackListAddress) external override onlyOwner whenNotPaused {
        require(blackListAddress != ZERO_ADDRESS, "ERC20Token: blackListAddress can not be Zero Address.");
        require(!_isBlackListUser(blackListAddress), "ERC20Token: given blackListAddress is already blacklisted");
        _addToBlackList(blackListAddress);
    
    }

    /**
     * @notice removeFromBlackList is use to remove the blacklisted user.
     * @dev This function would remove an address from the blacklist mapping.
     * @dev Only the owner can call this function.
     * @param blackListAddress The account to be removed from blacklist.
     */
    function removeFromBlackList(address blackListAddress) external override onlyOwner whenNotPaused {
        require(blackListAddress != ZERO_ADDRESS, "ERC20Token: blackListAddress can not be Zero Address.");
        require(_isBlackListUser(blackListAddress), "ERC20Token: given blackListAddress is not in blacklist");
        _removeFromBlackList(blackListAddress);
    }

    /**
     * @notice updateTokenPrice is use to update the token price
     * @param newTokenPrice is updated token price in wei
     * @dev Returns the contract balance.
     * @dev Only the owner can call this function.
     */
    function updateTokenPrice(uint256 newTokenPrice) external override onlyOwner {
        require(tokenPrice != newTokenPrice, "ERC20Token: newTokenPrice is can not be same as current tokenPrice.");
        tokenPrice = newTokenPrice;
    }

    /**
     * @notice getContractBalance is use to check contract balance
     * @dev Returns the contract balance
     * @return balance Contract balance in wei
     */
    function getContractBalance() public view returns (uint256 balance) {
        balance = address(this).balance;
    }

    /**
     * @dev to pause the contract.
     * @dev Only the owner can call this function.
     */
    function pause() external override onlyOwner {
        _pause();
    }

    /**
     * @dev to unpause the contract.
     * @dev Only the owner can call this function.
     */
    function unpause() external override onlyOwner {
        _unpause();
    }
}
