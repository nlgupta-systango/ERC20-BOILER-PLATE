// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
* @title Blacklist contract for ERC20Token Contract
* @author The Systango Team
*/

contract BlackList {

    /** Mapping between the address and boolean for blacklisting */
    mapping (address => bool) public blackList;

    /** Event to trigger the addition of address to blacklist mapping */
    event AddedToBlackList(address _user);

    /** Event to trigger the removal of address from blacklist mapping */
    event RemovedFromBlackList(address _user);
    
    /**
    * This function would add an address to the blacklist mapping
    * @param user The account to be added to blacklist
     */
    function _addToBlackList(address user) internal virtual returns (bool) {
        blackList[user] = true;
        emit AddedToBlackList(user);
        return true;
    }

    /**
    * This function would remove an address from the blacklist mapping
    * @param user The account to be removed from blacklist
    */
    function _removeFromBlackList(address user) internal virtual returns (bool) {
        blackList[user] = false;
        delete blackList[user];
        emit RemovedFromBlackList(user);
        return true;
    }

    /** This function would check an address from the blacklist mapping
    * @param _user The account to be checked from blacklist mapping
    */
    function _isBlackListUser(address _user) internal virtual returns (bool){
        return blackList[_user];
    }

    /** Modifier to check address from the blacklist mapping
    * @param _user The account to be checked from blacklist mapping
    */
    modifier whenNotBlackListedUser(address _user) {
        require(!_isBlackListUser(_user), "ERC20Token: This address is in blacklist");
        _;
    }
}
