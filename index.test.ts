jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import { fromWei, legos, startGanacheWithEthers } from "./utils";

import { buyDaiFromUniswap } from "./buyDaiFromUniswap";

describe("test stuff", () => {
  let wallet: Wallet, daiContract: Contract;

  beforeAll(async () => {
    wallet = await startGanacheWithEthers();
    daiContract = new ethers.Contract(
      legos.erc20.contracts.dai.address,
      legos.erc20.contracts.abi,
      wallet,
    );
  });

  test("initial DAI balance of 0", async () => {
    const daiBalance = await daiContract.balanceOf(wallet.address);
    expect(fromWei(daiBalance)).toBe("0.0");
  });

  test("initial ETH balance of ~1000 ETH", async () => {
    const ethBalance = await wallet.getBalance();
    expect(fromWei(ethBalance)).toBe("1000.0");
  });

  test("get some DAI", async () => {
    const { expectedDai, swap } = await buyDaiFromUniswap(5, wallet);

    const before = await daiContract.balanceOf(wallet.address);

    await swap();

    const after = await daiContract.balanceOf(wallet.address);

    expect(fromWei(before)).toBe("0.0");
    expect(fromWei(after)).toBe(fromWei(expectedDai));
  });
});
