import UniswapV3Service from "../UniswapV3Service";
import BrokkrStrategy from "./StrategyInterface";


export class BrokkrStrategy_XRange_TimeRestriced implements BrokkrStrategy {
    
    constructor(uniswapService: UniswapV3Service) {

    }

    async onSwap(tick: number, blocktime: number): Promise<any> {
        return 0
    }

}