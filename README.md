# Solidity Game - DexTwo Attack

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), DexTwo Level_

⚠️Do not try on mainnet!

## Task

Hacker the basic token contract below.

1. You are given 20 tokens to start with and you will beat the game if you somehow manage to get your hands on any additional tokens. Preferably a very large amount of tokens.

_Hint:_

1. What is an odometer?

## What will you learn?

1. Solidity Security Consideration
2. **Underflow** and **Overflow** in use of unsigned integers

## What is the most difficult challenge?

**You won't get success to attack if the target contract has been complied in Solidity 0.8.0 or uppper** 🤔

> [**Solidity v0.8.0 Breaking Changes**](https://docs.soliditylang.org/en/v0.8.5/080-breaking-changes.html?highlight=underflow#silent-changes-of-the-semantics)
>
> Arithmetic operations revert on **underflow** and **overflow**. You can use `unchecked { ... }` to use the previous wrapping behaviour.
>
> Checks for overflow are very common, so we made them the default to increase readability of code, even if it comes at a slight increase of gas costs.

I had tried to do everything in Solidity 0.8.5 at first time, but it didn't work, as it reverted transactions everytime it met underflow.

Finally, I found that Solidity included those checks by defaults while using sliencely more gas.

So, don't you need to use [`SafeMath`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol)?

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
