import { Signer, ethers } from "ethers";
import { legos } from "./utils";

export const buyDaiFromUniswap = async (ethToSpend: number, signer: Signer) => {
  const { factory, exchange } = legos.uniswap.contracts;
  const uniswapFactoryContract = new ethers.Contract(
    factory.address,
    factory.abi,
    signer,
  );

  const daiExchangeAddress = await uniswapFactoryContract.getExchange(
    legos.erc20.contracts.dai.address,
  );

  const daiExchangeContract = new ethers.Contract(
    daiExchangeAddress,
    exchange.abi,
    signer,
  );

  const expectedDai = await daiExchangeContract.getEthToTokenInputPrice(
    ethers.utils.parseEther(ethToSpend.toString()),
  );

  const swap = () =>
    daiExchangeContract.ethToTokenSwapInput(
      1, // min token retrieve amount
      2525644800, // random timestamp in the future (year 2050)
      {
        gasLimit: 4000000,
        value: ethers.utils.parseEther(ethToSpend.toString()),
      },
    );

  return { expectedDai, swap };
};
