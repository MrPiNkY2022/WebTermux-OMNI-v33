// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StakingRewards is AccessControl {
    IERC20 public immutable rewardsToken;
    IERC20 public immutable stakingToken;

    uint256 public rewardRate = 100; // Adjustable
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balances;

    uint256 private _totalSupply;

    constructor(address _stakingToken, address _rewardsToken) {
        rewardsToken = IERC20(_rewardsToken);
        stakingToken = IERC20(_stakingToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function totalSupply() external view returns (uint256) { return _totalSupply; }

    function balanceOf(address account) external view returns (uint256) { return balances[account]; }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        _totalSupply += amount;
        balances[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) {
        _totalSupply -= amount;
        balances[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
    }

    function getReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        rewardsToken.transfer(msg.sender, reward);
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + ((block.timestamp - lastUpdateTime) * rewardRate * 1e18 / _totalSupply);
    }

    function earned(address account) public view returns (uint256) {
        return (balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18) + rewards[account];
    }

    // Admin: notify reward amount, set rate, emergency withdraw
    function notifyRewardAmount(uint256 reward) external onlyRole(DEFAULT_ADMIN_ROLE) {
        rewardsToken.transferFrom(msg.sender, address(this), reward);
    }
}
