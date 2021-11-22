// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HackerToken is ERC20 {
  address public hacker;

  modifier onlyHacker() {
    require(msg.sender == hacker, "caller is not the hacker");
    _;
  }

  /// @dev Mint some amount of tokens to hacker initially.
  constructor(uint256 _amount) ERC20("HackerToken", "HTK") {
    hacker = payable(msg.sender);
    _mint(msg.sender, _amount);
  }

  /// @dev We will hack the target through front-end. See test files.
  function attack(address _target) public onlyHacker {}
}
