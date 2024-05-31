//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StorageContract {
	IERC20 public usdcToken;
	address public admin;
	uint256 public pricePerQuota;

	mapping(address => uint256) public quotas;

	event QuotaPurchased(address indexed user, uint256 amount);
	event QuotaUsed(address indexed user, uint256 amount);
	event AdminChanged(address indexed newAdmin);
	event pricePerQuotaChanged(uint256 newPrice);

	modifier onlyAdmin() {
		require(msg.sender == admin, "Not admin");
		_;
	}

	constructor(address _usdcToken) {
		usdcToken = IERC20(_usdcToken);
		admin = msg.sender;
	}

	function setPricePerQuota(uint256 _price) external onlyAdmin {
		pricePerQuota = _price;
		emit pricePerQuotaChanged(_price);
	}

	function purchasedQuota(uint256 amount) external {
		uint256 cost = amount * pricePerQuota;
		require(
			usdcToken.transferFrom(msg.sender, address(this), cost),
			"Payment failed"
		);

		quotas[msg.sender] += amount;
		emit QuotaPurchased(msg.sender, amount);
	}

	function useQuota(address user, uint256 amount) external onlyAdmin {
		require(quotas[user] >= amount, "Insufficient quota");
		quotas[user] -= amount;
		emit QuotaUsed(user, amount);
	}

	function changeAdmin(address newAdmin) external onlyAdmin {
		admin = newAdmin;
		emit AdminChanged(newAdmin);
	}

	function getQuota(address user) external view returns (uint256) {
		return quotas[user];
	}
}
