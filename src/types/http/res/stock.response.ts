interface StockResponse{
    currency: string;
    description: string;
    displaySymbol: string;
    figi: string;
    mic: string;
    symbol: string;
    type: string;
}

interface StockCurrentPriceResponse{
    c: number;  // Current price
    h: number;  // High price of the day
    l: number;  // Low price of the day
    o: number;  // Open price of the day
    pc: number; // Previous close price
    t: number;  // Timestamp
}


export type GetStockSymbolsResponse = StockResponse[];
export type GetStockQuoteResponse = StockCurrentPriceResponse;