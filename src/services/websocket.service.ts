import { ConnectionStatus, WebSocketConfig } from '@/types/websocket.types';

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private subscribedSymbols = new Set<string>();
  private messageHandlers = new Map<string, (data: any) => void>();

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.config.url}?token=${this.config.token}`;        
        const timeoutId = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000); 

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          clearTimeout(timeoutId);
          this.reconnectAttempts = 0;
          this.resubscribeToSymbols();
          resolve();
        };

        this.ws.onmessage = (event) => {
          //this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onclose = () => {
          clearTimeout(timeoutId);
          this.handleReconnection();
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeoutId);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(symbol: string): void {
    this.subscribedSymbols.add(symbol);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    }
  }

  unsubscribe(symbol: string): void {
    this.subscribedSymbols.delete(symbol);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }


  private handleReconnection(): void {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
      this.reconnectAttempts++;
      this.reconnectTimer = setTimeout(() => {
        this.connect().catch(console.error);
      }, this.config.reconnectInterval);
    }
  }

  private resubscribeToSymbols(): void {
    this.subscribedSymbols.forEach(symbol => {
      this.ws?.send(JSON.stringify({ type: 'subscribe', symbol }));
    });
  }

  on(event: string, handler: (data: any) => void): void {
    this.messageHandlers.set(event, handler);
  }

  off(event: string): void {
    this.messageHandlers.delete(event);
  }

  getConnectionStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }
}

export default WebSocketService;
