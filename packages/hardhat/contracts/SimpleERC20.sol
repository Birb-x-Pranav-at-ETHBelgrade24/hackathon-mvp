// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20 is ERC20 {
	address public owner;

	constructor() ERC20("StorageOP20", "STOP20") {
		_mint(msg.sender, 1000000 ether);
		owner = msg.sender;
	}

	function decimals() public view virtual override returns (uint8) {
		return 18;
	}
}
