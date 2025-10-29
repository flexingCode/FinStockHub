export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Finnhub WebSocket message types
export type FinnhubTrade = {
  s: string; // Symbol
  p: number; // Price
  t: number; // Timestamp
  v: number; // Volume
};

export type FinnhubTradeMessage = {
  type: 'trade';
  data: FinnhubTrade[];
};

export type FinnhubPingMessage = {
  type: 'ping';
};

export type FinnhubSubscriptionMessage = {
  type: 'subscribe' | 'unsubscribe';
  symbol: string;
};

export type FinnhubMessage = FinnhubTradeMessage | FinnhubPingMessage | FinnhubSubscriptionMessage;

export type WebSocketConfig = {
  url: string;
  token: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
};

export type WebSocketContextType = {
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
  connectionStatus: ConnectionStatus;
};
