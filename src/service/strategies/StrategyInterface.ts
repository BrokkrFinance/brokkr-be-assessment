interface BrokkrStrategy {
    
    onSwap(tick: number, blocktime: number): Promise<any>

}

export default BrokkrStrategy