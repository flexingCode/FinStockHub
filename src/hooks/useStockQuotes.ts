import { useState, useEffect, useCallback } from 'react';
import http from '@/http';
import { GetStockQuoteResponse, StockCurrentPriceResponse } from '@/types/http/res/stock.response';
import stockServices from '@/services/stock.services';
import { useWebSocket } from '@/providers/WebSocketProvider';
import useWebSocketStore from '@/stores/websocketStore';

interface UseStockQuotesProps {
  symbols: string[];
  batchSize?: number;
  onBatchLoaded?: (quotes: StockCurrentPriceResponse[]) => void;
}

interface UseStockQuotesReturn {
  quotes: { [symbol: string]: StockCurrentPriceResponse };
  loading: boolean;
  error: string | null;
  loadNextBatch: () => Promise<void>;
  hasMore: boolean;
  refresh: () => Promise<void>;
}

export const useStockQuotes = ({
  symbols,
  batchSize = 20,
  onBatchLoaded
}: UseStockQuotesProps): UseStockQuotesReturn => {
  const [quotes, setQuotes] = useState<{ [symbol: string]: StockCurrentPriceResponse }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { subscribe } = useWebSocket();
  const { stockPrices } = useWebSocketStore();
  const hasMore = currentIndex < symbols.length;

  
  useEffect(() => {
    Object.entries(stockPrices).forEach(([symbol, priceUpdate]) => {
      setQuotes(prev => {
        if (prev[symbol]) {
          return {
            ...prev,
            [symbol]: {
              ...prev[symbol],
              pc: prev[symbol].c, 
              c: priceUpdate.price, 
              t: priceUpdate.timestamp 
            }
          };
        }
        return prev;
      });
    });
  }, [stockPrices]);

  const loadNextBatch = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const batch = symbols.slice(currentIndex, currentIndex + batchSize);
      
      console.log('Loading initial data for batch:', batch);
      
      const promises = batch.map(async symbol => {
        try {
          const data = await stockServices.getStockQuote(symbol);
          return { symbol, data };
        } catch (err) {
          console.error(`Failed to fetch quote for ${symbol}:`, err);
          return { symbol, data: null };
        }
      });

      const results = await Promise.all(promises);
      const newQuotes: { [symbol: string]: StockCurrentPriceResponse } = {};
      const validQuotes: StockCurrentPriceResponse[] = [];

      results.forEach(({ symbol, data }) => {
        if (data) {
          newQuotes[symbol] = data;
          validQuotes.push(data);
        }
      });

      setQuotes(prev => ({ ...prev, ...newQuotes }));
      
      batch.forEach(symbol => {
        subscribe(symbol);
      });

      setCurrentIndex(prev => prev + batchSize);
      
      onBatchLoaded?.(validQuotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  }, [symbols, batchSize, currentIndex, loading, hasMore, onBatchLoaded]);

  useEffect(() => {
    if (symbols.length > 0 && currentIndex === 0) {
      loadNextBatch();
    }
  }, [symbols.length]);

  const refresh = useCallback(async () => {
    setCurrentIndex(0);
    setQuotes({});
    await loadNextBatch();
  }, [loadNextBatch]);

  return {
    quotes,
    loading,
    error,
    loadNextBatch,
    hasMore,
    refresh
  };
};
