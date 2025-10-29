import { ConnectionStatus, WebSocketConfig, FinnhubMessage, FinnhubTradeMessage } from '@/types/websocket.types';
import logger from '@/utils/logger';

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private subscribedSymbols = new Set<string>();
  private messageHandlers = new Map<string, (data: FinnhubMessage) => void>();

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  emit(event: string, data: FinnhubMessage): void {
    const handler = this.messageHandlers.get(event);
    if (handler) {
      handler(data);
    }
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
          try {
            const message = JSON.parse(event.data) as FinnhubMessage;
            
            // Validate message structure
            if (!message || typeof message !== 'object' || !message.type) {
              logger.warn('WebSocket: Received invalid message format', message);
              return;
            }

            logger.debug('WebSocket received message', { type: message.type });
            this.emit('message', message);
          } catch (error) {
            logger.error('WebSocket: Error parsing message', error);
          }
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
      const message = JSON.stringify({ type: 'subscribe', symbol });
      logger.debug('Sending subscription', { symbol });
      this.ws.send(message);
    } else {
      logger.debug('WebSocket not ready, subscription queued', { symbol });
    }
  }

  unsubscribe(symbol: string): void {
    this.subscribedSymbols.delete(symbol);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }


  private handleReconnection(): void {
    if (this.reconnectAttempts < (this.config.maxReconnectAttempts ?? 10)) {
      this.reconnectAttempts++;
      const delay = this.config.reconnectInterval ?? 5000;
      // Exponential backoff with jitter
      const backoffDelay = delay * Math.pow(2, this.reconnectAttempts - 1) + Math.random() * 1000;
      
      logger.debug('WebSocket reconnecting', { 
        attempt: this.reconnectAttempts, 
        delay: Math.round(backoffDelay) 
      });
      
      this.reconnectTimer = setTimeout(() => {
        this.connect().catch((error) => {
          logger.error('WebSocket reconnection failed', error);
        });
      }, backoffDelay);
    } else {
      logger.error('WebSocket: Max reconnection attempts reached');
    }
  }

  private resubscribeToSymbols(): void {
    this.subscribedSymbols.forEach(symbol => {
      this.ws?.send(JSON.stringify({ type: 'subscribe', symbol }));
    });
  }

  on(event: string, handler: (data: FinnhubMessage) => void): void {
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
