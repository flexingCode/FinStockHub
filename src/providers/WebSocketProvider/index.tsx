import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { FINNHUB_API_KEY } from '@env';
import { WebSocketContextType } from '@/types/websocket.types';
import WebSocketService from '@/services/websocket.service';
import useWebSocketStore from '@/stores/websocketStore';
import { usePriceHistoryStore } from '@/stores/priceHistoryStore';
import { useLimitAlertsStore } from '@/stores/limitAlertsStore';
import { Toast } from 'toastify-react-native';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const {
    connectionStatus,
    setConnectionStatus,
    setError,
    addSubscribedSymbol,
    removeSubscribedSymbol,
    updateStockPrice,
  } = useWebSocketStore();

  const {limitAlerts} = useLimitAlertsStore()

  const { addPricePoint } = usePriceHistoryStore();

  useEffect(() => {
    console.log('WebSocketProvider: Initializing...');
    const initializeWebSocket = async () => {
      try {
        const config = {
          url: 'wss://ws.finnhub.io',
          token: FINNHUB_API_KEY,
          reconnectInterval: 5000,
          maxReconnectAttempts: 10,
        };

        console.log('WebSocketProvider: Creating service...');
        wsServiceRef.current = new WebSocketService(config);

        wsServiceRef.current.on('message', (message: any) => {
          console.log('WebSocketProvider: Message received:', message);

          if (message.type === 'trade' && message.data && Array.isArray(message.data)) {
            console.log('Trade data received:', message.data);

            message.data.forEach((trade: any) => {
              if (trade.s && trade.p) {
                console.log(`Price update: ${trade.s} = $${trade.p}`);
                const timestamp = trade.t || Date.now();
                updateStockPrice(trade.s, trade.p, timestamp);
                addPricePoint(trade.s, trade.p, trade.v);
              }
            });
          }
        });

        console.log('WebSocketProvider: Connecting...');
        await wsServiceRef.current.connect();
        console.log('WebSocket connected');
        setConnectionStatus('connected');
      } catch (error) {
        console.error('WebSocketProvider: Connection failed:', error);
        setError(error instanceof Error ? error.message : 'Connection failed');
        setConnectionStatus('error');
      }
    };

    initializeWebSocket();

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, [setConnectionStatus, setError]);

  const connect = async () => {
    if (wsServiceRef.current) {
      try {
        setConnectionStatus('connecting');
        await wsServiceRef.current.connect();
        setConnectionStatus('connected');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Connection failed');
        setConnectionStatus('error');
      }
    }
  };

  const disconnect = () => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
      setConnectionStatus('disconnected');
    }
  };

  const subscribe = (symbol: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.subscribe(symbol);
      addSubscribedSymbol(symbol);
    }
  };

  const unsubscribe = (symbol: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.unsubscribe(symbol);
      removeSubscribedSymbol(symbol);
    }
  };

  const contextValue: WebSocketContextType = {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    connectionStatus,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketProvider;
