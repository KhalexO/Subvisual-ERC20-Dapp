// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

error NotOwner();

contract SubvisualToken is ERC20, Ownable {
    constructor() ERC20("Subvisual Token", "SVT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external {
        if (msg.sender != owner()) revert NotOwner();
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
