import { FeeAmount, toHex } from "@uniswap/v3-sdk";
import { BigNumber, utils } from "ethers";
import UniswapV3Service from "../UniswapV3Service";
import BrokkrStrategy from "./StrategyInterface";
import { Token } from "@uniswap/sdk-core";

export class BrokkrStrategy_XRange_TimeRestriced implements BrokkrStrategy {
  private uniswapService: UniswapV3Service;
  private lastRebalance: number;
  private rebalancesToday: number;
  private range: number;

  constructor(uniswapService: UniswapV3Service) {
    this.uniswapService = uniswapService;
    this.lastRebalance = 0;
    this.rebalancesToday = 0;
    this.range = 2; // initial range is 2%
  }

  async onSwap(tick: number, blocktime: number): Promise<any> {
    const ONE_HOUR = 3600;
    const ONE_DAY = 86400;

    // check if a new day has started
    if (
      blocktime - this.lastRebalance >= ONE_DAY ||
      (new Date(blocktime * 1000).getUTCHours() === 6 &&
        this.rebalancesToday > 0)
    ) {
      this.rebalancesToday = 0;
      this.range = 2;
    }

    // check if an hour has passed since the last rebalance
    if (blocktime - this.lastRebalance < ONE_HOUR) {
      throw new Error("Max 1 rebalance per hour");
    }

    if (this.rebalancesToday === 5) {
      throw new Error("Max 5 rebalances per day");
    }

    // calculate the tick range based on the current tick and range
    const tickLower = tick - Math.floor((tick * this.range) / 2 / 100);
    const tickUpper = tick + Math.floor((tick * this.range) / 2 / 100);

    // mint a new position NFT
    const tokenId = await this.uniswapService.mintPositionNFT(
      new Token(1, this.uniswapService.token0Address, 10),
      new Token(1, this.uniswapService.token1Address, 10),
      FeeAmount.MEDIUM,
      utils.parseUnits(tick.toString(), 0).toString(),
      utils.parseUnits("1", 0).toString(),
      tick,
      tickLower,
      tickUpper,
      utils.parseUnits("1", 0).toString(),
      utils.parseUnits("1", 0).toString()
    );

    // update the last rebalance time and increment the number of rebalances today
    this.lastRebalance = blocktime;
    this.rebalancesToday++;

    // if this is the 4th rebalance, increase the range to 5%
    if (this.rebalancesToday === 3) {
      this.range = 5;
    }

    return tokenId;
  }
}
