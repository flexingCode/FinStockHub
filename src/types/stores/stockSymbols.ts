import { GetStockSymbolsResponse } from "@/types/http/res/stock.response";

export type StockSymbolStore = {
    stockSymbols: GetStockSymbolsResponse;
    setStockSymbols: (stockSymbols: GetStockSymbolsResponse) => void;
}