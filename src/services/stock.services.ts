import http from "@/http";

const getStockSymbols = async (exchange: string) => {
    const response = await http.get(`/stock/symbol`, {
        params: {
            exchange,
        },
    });
    return response.data
};

const stockServices = {
    getStockSymbols,
};

export default stockServices;