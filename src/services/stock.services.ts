import http from "@/http";

const getStockSymbols = async (exchange: string) => {
    const response = await http.get(`/stock/symbol`, {
        params: {
            exchange,
        },
    });
    return response.data
};

const getStockQuote = async (symbol: string) => {
    const response = await http.get(`/quote`, {
        params: {
            symbol,
        },
    });
    return response.data;
}

const stockServices = {
    getStockSymbols,
    getStockQuote,
};

export default stockServices;