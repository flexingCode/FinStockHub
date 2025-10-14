export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export type FinnhubMessage<T> = {
  type: string;
  data: T;
};


export type WebSocketConfig = {
  url: string;
  token: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
};

export type WebSocketContextType = {
  connect: () => void;
  disconnect: () => void;
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
  connectionStatus: ConnectionStatus;
};
