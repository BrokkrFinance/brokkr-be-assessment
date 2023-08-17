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
            "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", BigNumber.from(100),  // USDC in wallet
            "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", BigNumber.from(100),  // wETH in wallet
            0                                                                   // current tick 0 => 1 USDC = 1 wETH
        );
    })
    
    test("Max 1 rebalance per hour", async () => {
        const strategy: BrokkrStrategy = new BrokkrStrategy_XRange_TimeRestriced(uniswapService)
        /*
            FYI: for tick 10000, the price of token0 in terms of token1 is approximately 1.1052
        */ 
        await strategy.onSwap(10000, 1691997410)                         // 1691997410 = 08/14/2023 @ 7:16:50am	
        
        // range should be 2%
        expect(uniswapService.getPositions()[0].positiondata.tickLower).toBeGreaterThan(9895)    // current tick ~ -1%
        expect(uniswapService.getPositions()[0].positiondata.tickLower).toBeLessThan(9905)       // current tick ~ -1%
        expect(uniswapService.getPositions()[0].positiondata.tickUpper).toBeLessThan(10105)      // current tick ~ +1%
        expect(uniswapService.getPositions()[0].positiondata.tickUpper).toBeGreaterThan(10095)   // current tick ~ +1%
        
        
        expect((await strategy.onSwap(20000, 1691993809))).toThrowError()  // 1691993809 = 08/14/2023 @ 8:16:49am
        // swap should be possible again
        await strategy.onSwap(20000, 1691993809) // 1691993810 = 08/14/2023 @ 8:16:50am
    })

    test("Start LPing with a 2% range with 3 possible rebalances. If it reaches the 4th rebalance, set the 4th LP range to 5% with a maximum of 1 more rebalance that day ", () => {
        // TODO
    })

    test("Max 3 rebalances per day with a 2% range, Max 2 rebalances per day with a 5% range", () => {
        // TODO
    })

    test("If we get capped by the rebalances, start again the next day at 6AM with the 2% range at the current price", () => {
        // TODO
    })
})
