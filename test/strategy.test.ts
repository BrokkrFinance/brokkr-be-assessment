import UniswapV3Service from "../src/service/UniswapV3Service";
import { BigNumber } from "ethers";

describe("X% range, time-restricted (0.05% fee pool) (C)", () => {
    let uniswapService;
    beforeEach(() => {
        uniswapService = new UniswapV3Service(
            "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", BigNumber.from(0),  // USDC in wallet
            "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", BigNumber.from(0),  // wETH in wallet
            10000                                                             // current uniswap v3 pool tick for USDC/wETH
        );
    })
    
    test("", () => {
        
    })
})
