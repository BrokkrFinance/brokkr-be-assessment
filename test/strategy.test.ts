import UniswapV3Service from "../src/service/UniswapV3Service";
import { BigNumber } from "ethers";
import BrokkrStrategy from "../src/service/strategies/StrategyInterface";
import { BrokkrStrategy_XRange_TimeRestriced } from "../src/service/strategies/BrokkrStrategy_XRange_TimeRestriced";

/* 
  2% range, time-restricted (0.05% fee pool) (C)**
    1. Start LPing with a 2% range with 3 possible rebalances. If it reaches the 4th rebalance, set the 4th LP range to 5% with a maximum of 1 more rebalance that day 
    2. Max 1 rebalance per hour
    3. Max 3 rebalances per day with a 2% range, Max 2 rebalances per day with a 5% range
    4. If we get capped by the rebalances, start again the next day at 6AM with the 2% range at the current price
*/

describe("X% range, time-restricted", () => {
  let uniswapService: UniswapV3Service;

  beforeEach(() => {
    uniswapService = new UniswapV3Service(
      "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      BigNumber.from(100), // USDC in wallet
      "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      BigNumber.from(100), // wETH in wallet
      0 // current tick 0 => 1 USDC = 1 wETH
    );
  });

  test("Max 1 rebalance per hour", async () => {
    const strategy: BrokkrStrategy = new BrokkrStrategy_XRange_TimeRestriced(
      uniswapService
    );
    /*
            FYI: for tick 10000, the price of token0 in terms of token1 is approximately 1.1052
        */
    await strategy.onSwap(10000, 1691997410); // 1691997410 = 08/14/2023 @ 7:16:50am

    const positions = await uniswapService.getPositions();

    // range should be 2%
    expect(positions[0].positiondata.tickLower).toBeGreaterThan(9895); // current tick ~ -1%
    expect(positions[0].positiondata.tickLower).toBeLessThan(9905); // current tick ~ -1%
    expect(positions[0].positiondata.tickUpper).toBeLessThan(10105); // current tick ~ +1%
    expect(positions[0].positiondata.tickUpper).toBeGreaterThan(10095); // current tick ~ +1%

    expect(strategy.onSwap(20000, 1692001009)).rejects.toThrow(
      "Max 1 rebalance per hour"
    ); // 1692001009 = 08/14/2023 @ 8:16:49am
    // swap should be possible again
    await strategy.onSwap(20000, 1692001010); // 1692001010 = 08/14/2023 @ 8:16:50am
  });

  test("Start LPing with a 2% range with 3 possible rebalances. If it reaches the 4th rebalance, set the 4th LP range to 5% with a maximum of 1 more rebalance that day", async () => {
    const strategy: BrokkrStrategy = new BrokkrStrategy_XRange_TimeRestriced(
      uniswapService
    );

    await strategy.onSwap(10000, 1691997410);
    await strategy.onSwap(11000, 1692001010);
    await strategy.onSwap(12000, 1692004610);

    let positions = await uniswapService.getPositions();
    // range should be 2%
    expect(positions[2].positiondata.tickLower).toBeGreaterThan(11875); // current tick ~ -1%
    expect(positions[2].positiondata.tickLower).toBeLessThan(11995); // current tick ~ -1%
    expect(positions[2].positiondata.tickUpper).toBeLessThan(12235); // current tick ~ +1%
    expect(positions[2].positiondata.tickUpper).toBeGreaterThan(12115); // current tick ~ +1%

    await strategy.onSwap(10000, 1692008210);
    positions = await uniswapService.getPositions();
    expect(positions[3].positiondata.tickLower).toBeGreaterThan(9745);
    expect(positions[3].positiondata.tickLower).toBeLessThan(9755);
    expect(positions[3].positiondata.tickUpper).toBeGreaterThan(10245);
    expect(positions[3].positiondata.tickUpper).toBeLessThan(10255);

    await strategy.onSwap(10000, 1692011810);
    positions = await uniswapService.getPositions();
    expect(positions[4].positiondata.tickLower).toBeGreaterThan(9745);
    expect(positions[4].positiondata.tickLower).toBeLessThan(9755);
    expect(positions[4].positiondata.tickUpper).toBeGreaterThan(10245);
    expect(positions[4].positiondata.tickUpper).toBeLessThan(10255);
  });

  test("Max 3 rebalances per day with a 2% range, Max 2 rebalances per day with a 5% range", async () => {
    const strategy: BrokkrStrategy = new BrokkrStrategy_XRange_TimeRestriced(
      uniswapService
    );

    await strategy.onSwap(10000, 1691997410);
    let positions = await uniswapService.getPositions();
    // range should be 2%
    expect(positions[0].positiondata.tickLower).toBeGreaterThan(9895); // current tick ~ -1%
    expect(positions[0].positiondata.tickLower).toBeLessThan(9905); // current tick ~ -1%
    expect(positions[0].positiondata.tickUpper).toBeLessThan(10105); // current tick ~ +1%
    expect(positions[0].positiondata.tickUpper).toBeGreaterThan(10095); // current tick ~ +1%
    await strategy.onSwap(11000, 1692001010);
    await strategy.onSwap(12000, 1692004610);

    positions = await uniswapService.getPositions();
    // range should be 2%
    expect(positions[2].positiondata.tickLower).toBeGreaterThan(11875); // current tick ~ -1%
    expect(positions[2].positiondata.tickLower).toBeLessThan(11995); // current tick ~ -1%
    expect(positions[2].positiondata.tickUpper).toBeLessThan(12235); // current tick ~ +1%
    expect(positions[2].positiondata.tickUpper).toBeGreaterThan(12115); // current tick ~ +1%

    await strategy.onSwap(10000, 1692008210);
    positions = await uniswapService.getPositions();
    expect(positions[3].positiondata.tickLower).toBeGreaterThan(9745);
    expect(positions[3].positiondata.tickLower).toBeLessThan(9755);
    expect(positions[3].positiondata.tickUpper).toBeGreaterThan(10245);
    expect(positions[3].positiondata.tickUpper).toBeLessThan(10255);

    await strategy.onSwap(10000, 1692011810);
    positions = await uniswapService.getPositions();
    expect(positions[4].positiondata.tickLower).toBeGreaterThan(9745);
    expect(positions[4].positiondata.tickLower).toBeLessThan(9755);
    expect(positions[4].positiondata.tickUpper).toBeGreaterThan(10245);
    expect(positions[4].positiondata.tickUpper).toBeLessThan(10255);

    expect(strategy.onSwap(10000, 1692015410)).rejects.toThrow(
      "Max 5 rebalances per day"
    );
  });

  test("If we get capped by the rebalances, start again the next day at 6AM with the 2% range at the current price", async () => {
    const strategy: BrokkrStrategy = new BrokkrStrategy_XRange_TimeRestriced(
      uniswapService
    );

    // Perform 3 rebalances
    for (let i = 0; i < 3; i++) {
      await strategy.onSwap(10000 + i * 1000, 1691997410 + i * 3600);
    }

    // Perform 4th rebalance, should not throw error
    await strategy.onSwap(13000, 1692008210);

    // Perform 5th rebalance, should throw error as only 1 rebalance is allowed after the 4th with 5% range
    await strategy.onSwap(14000, 1692011810);

    // Attempt to rebalance at 5AM next day, should still throw error as it's before 6AM
    await expect(strategy.onSwap(14000, 1692076810)).rejects.toThrow(
      "Max 5 rebalances per day"
    ); // 1692076810 = 08/15/2023 @ 5:00:10am (UTC)

    // Attempt to rebalance at 6AM next day, should not throw error as it's a new day
    await strategy.onSwap(14000, 1692080410); // 1692080410 = 08/15/2023 @ 6:00:10am (UTC)
  });
});
