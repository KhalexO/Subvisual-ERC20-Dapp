// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SubvisualToken.sol";

contract SubvisualTokenTest is Test {
    SubvisualToken token;

    address owner = address(this);
    address user = address(0x1);

    function setUp() public {
        token = new SubvisualToken();
    }

    function testMintIncreasesBalanceAndSupply() public {
        uint256 amount = 100 ether;

        token.mint(user, amount);

        assertEq(token.balanceOf(user), amount);
        assertEq(token.totalSupply(), amount);
    }

    function testMintFailsIfNotOwner() public {
        vm.prank(user);
        vm.expectRevert(NotOwner.selector);

        token.mint(user, 100 ether);
    }

    function testTransferWorks() public {
        token.mint(owner, 100 ether);

        token.transfer(user, 40 ether);

        assertEq(token.balanceOf(user), 40 ether);
        assertEq(token.balanceOf(owner), 60 ether);
    }

    function testBurnReducesSupply() public {
        token.mint(owner, 100 ether);

        token.burn(30 ether);

        assertEq(token.totalSupply(), 70 ether);
    }
}
