import { useState, useEffect, useCallback, useRef } from 'react';
import http from '@/http';
import { GetStockQuoteResponse, StockCurrentPriceResponse } from '@/types/http/res/stock.response';
import stockServices from '@/services/stock.services';
import { useWebSocket } from '@/providers/WebSocketProvider';
import useWebSocketStore from '@/stores/websocketStore';
import { usePriceHistoryStore } from '@/stores/priceHistoryStore';
import { useLimitAlertsStore } from '@/stores/limitAlertsStore';
import { Toast } from 'toastify-react-native';

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
  const {limitAlerts} = useLimitAlertsStore()
  const [quotes, setQuotes] = useState<{ [symbol: string]: StockCurrentPriceResponse }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { subscribe, unsubscribe } = useWebSocket();
  const { stockPrices } = useWebSocketStore();
  const { addPricePoint } = usePriceHistoryStore();
  const hasMore = currentIndex < symbols.length;

  const subscribedSymbolsRef = useRef<string[]>([]);
  const MAX_SUBSCRIPTIONS = 30;
  const UNSUBSCRIBE_BATCH = 10;

  const manageSubscriptions = useCallback((newSymbols: string[]) => {
    const currentSubscriptions = [...subscribedSymbolsRef.current];
    
    newSymbols.forEach(symbol => {
      if (!currentSubscriptions.includes(symbol)) {
        currentSubscriptions.push(symbol);
        subscribe(symbol);
      }
    });

    if (currentSubscriptions.length > MAX_SUBSCRIPTIONS) {
      const symbolsToUnsubscribe = currentSubscriptions.slice(0, UNSUBSCRIBE_BATCH);
      
      symbolsToUnsubscribe.forEach(symbol => {
        unsubscribe(symbol);
      });

      const updatedSubscriptions = currentSubscriptions.slice(UNSUBSCRIBE_BATCH);
      symbolsToUnsubscribe.forEach(symbol => {
        setQuotes(prev => {
          const newQuotes = { ...prev };
          delete newQuotes[symbol];
          return newQuotes;
        });
      });

      subscribedSymbolsRef.current = updatedSubscriptions;
    } else {
      subscribedSymbolsRef.current = currentSubscriptions;
    }
  }, [subscribe, unsubscribe]);

  
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
          addPricePoint(symbol, data.c, 0);
        }
        limitAlerts.forEach((alert) => {
          console.log('Limit alert:', alert.symbol, data.c, alert.limit);
          if (alert.symbol === symbol && data.c >= alert.limit) {
            Toast.info(`Limit alert: ${alert.symbol} = $${alert.limit}`);
          }
        });
      });

      

      setQuotes(prev => ({ ...prev, ...newQuotes }));
      
      manageSubscriptions(batch);

      setCurrentIndex(prev => prev + batchSize);      
      
      onBatchLoaded?.(validQuotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  }, [symbols, batchSize, currentIndex, loading, hasMore, onBatchLoaded, manageSubscriptions]);

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
