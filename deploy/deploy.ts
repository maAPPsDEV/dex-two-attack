import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

import { DexTwo, SwappableTokenTwo } from "../typechain";

const deployOndoDistributor: DeployFunction = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer, hacker } = await getNamedAccounts();

  let result = await deploy("SwappableTokenTwo", {
    from: deployer,
    args: ["Token A", "TKNA", 110],
    log: true,
  });
  const tokenA: SwappableTokenTwo = await ethers.getContractAt(
    "SwappableTokenTwo",
    result.address
  );

  result = await deploy("SwappableTokenTwo", {
    from: deployer,
    args: ["Token B", "TKNB", 110],
    log: true,
  });
  const tokenB: SwappableTokenTwo = await ethers.getContractAt(
    "SwappableTokenTwo",
    result.address
  );

  await deploy("DexTwo", {
    from: deployer,
    args: [tokenA.address, tokenB.address],
    log: true,
  });
  const dex: DexTwo = await ethers.getContract("DexTwo");

  // initialize game environment
  await tokenA.approve(dex.address, 100);
  await tokenB.approve(dex.address, 100);
  await dex.addLiquidity(tokenA.address, 100);
  await dex.addLiquidity(tokenB.address, 100);
  await tokenA.transfer(hacker, 10);
  await tokenB.transfer(hacker, 10);
};

export default deployOndoDistributor;
deployOndoDistributor.tags = ["DexTwo"];
deployOndoDistributor.dependencies = [];
