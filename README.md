# Solidity Game - DexTwo Attack

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), DexTwo Level_

Please look at [Dex](https://github.com/maAPPsDEV/dex-attack) for the previous Dex game.

⚠️Do not try on mainnet!

## Task

This game will ask you to break `DexTwo`, a subtlely modified [Dex](https://github.com/maAPPsDEV/dex-attack) contract from the previous game, in a different way.

You need to drain all balances of token1 and token2 from the `DexTwo` contract to succeed in this game.

You will still start with 10 tokens of `token1` and 10 of `token2`. The DEX contract still starts with 100 of each token.


_Hint:_

1. How has the `swap` method been modified?
2. Could you use a custom token contract in your attack?


## What will you learn?

1. AMM - Automated Market Maker
2. Swap Pricing

## What is the most difficult challenge?

Ow, it isn't such difficult game 🤕, just think about the hint and keep track where the swap price is populated.

If you followed the Solidity games until now successfully, then you should solve it with none of hints.

👍

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DexTwo {
  address public token1;
  address public token2;

  constructor(address _token1, address _token2) {
    token1 = _token1;
    token2 = _token2;
  }

  function swap(
    address from,
    address to,
    uint256 amount
  ) public {
    require(IERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
    uint256 swap_amount = getSwapAmount(from, to, amount);
    IERC20(from).transferFrom(msg.sender, address(this), amount);
    IERC20(to).approve(address(this), swap_amount);
    IERC20(to).transferFrom(address(this), msg.sender, swap_amount);
  }

  function addLiquidity(address token_address, uint256 amount) public {
    IERC20(token_address).transferFrom(msg.sender, address(this), amount);
  }

  function getSwapAmount(
    address from,
    address to,
    uint256 amount
  ) public view returns (uint256) {
    return ((amount * IERC20(to).balanceOf(address(this))) /
      IERC20(from).balanceOf(address(this)));
  }

  function approve(address spender, uint256 amount) public {
    SwappableTokenTwo(token1).approve(spender, amount);
    SwappableTokenTwo(token2).approve(spender, amount);
  }

  function balanceOf(address token, address account)
    public
    view
    returns (uint256)
  {
    return IERC20(token).balanceOf(account);
  }
}

contract SwappableTokenTwo is ERC20 {
  constructor(
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) ERC20(name, symbol) {
    _mint(msg.sender, initialSupply);
  }
}

```

## Configuration

### Install Dependencies

```
yarn install
```

## Test and Attack!💥

### Run Tests

```
yarn test
```

You should the result as following:

```
  Destroy Dex
    √ verify game state
    √ deploy HackerToken (52ms)
    √ addLiquidity as HackerToken
    √ should drain TokenA out (43ms)
    √ should drain TokenB out
    √ DexTwo has been destroyed


  6 passing (5s)

```
