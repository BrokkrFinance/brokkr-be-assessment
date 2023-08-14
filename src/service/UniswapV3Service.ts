import { Token, BigintIsh, CurrencyAmount } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { BigNumber } from "ethers";

export type LPPosition = {
    tokenId: number, 
    positiondata: {
        token0: Token, 
        token1: Token,
        feeAmount: FeeAmount,
        tickLower: number,
        tickUpper: number
    }
}

export default class UniswapV3Service {

    private positions: LPPosition[] = []
    private tick: number

    private token0Address: string
    private token1Address: string
    private tokenAmounts: [string][] = []

    private tokenIdCounter = 0;

    constructor(token0Address: string, token0Amount: BigNumber, token1Address: string, token1Amount: BigNumber, initialTick: number) {
        this.token0Address = token0Address.toLowerCase()
        this.token1Address = token1Address.toLowerCase()
        this.tokenAmounts[this.token0Address] = token0Amount
        this.tokenAmounts[this.token1Address] = token1Amount
        this.tick = initialTick
    }

    updateTick(tick: number) {
        this.tick = tick
    }

    async mintPositionNFT(token0: Token, token1: Token, feeAmount: FeeAmount, sqrtRatioX96: BigintIsh, liquidity: BigintIsh, tickCurrent: number, tickLower: number, tickUpper: number, amount0: BigintIsh, amount1: BigintIsh): Promise<number> {
        this.positions.push({
            tokenId: this.tokenIdCounter++,
            positiondata: {
                token0: token0,
                token1: token1,
                feeAmount: feeAmount,
                tickLower: tickLower,
                tickUpper: tickUpper
            }
        })
        return this.tokenIdCounter
    }
    async removeAllLiquidity(positionId: number): Promise<any> {
        this.positions = this.positions.filter(position => position.tokenId !== positionId);
        return 0
    }
    async getPosition(positionId: number): Promise<any> {
        for(let i=0; i<this.positions.length; i++) {
            if(this.positions[i].tokenId == positionId){
                return this.positions[i].positiondata
            }
        }
    }
    async getPositions(): Promise<LPPosition[]> {
        return this.positions
    }
    async getAmountOfTokens(token0: Token, token1: Token): Promise<[BigNumber, BigNumber]> {
        return [(await this.getAmountOfToken(token0)), (await this.getAmountOfToken(token1))]
    }
    async getAmountOfToken(token: Token): Promise<BigNumber> {
        return this.tokenAmounts[token.address.toLowerCase()]
    }

}