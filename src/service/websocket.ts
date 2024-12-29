export interface WebSocketMessage {
    message: string;
    query_type: string;
    context_filter?: {
      metadata?: {
        category?: string;
      };
    };
  }
  
  export interface IncomingWebSocketData {
    type: string;
    response_id?: string;
    data?: string;
  }
  
  export type WebSocketMessageHandler = (data: IncomingWebSocketData) => void;
  export type ConnectionStatusHandler = (status: string) => void;
  
  class WebSocketService {
    private socket: WebSocket | null = null;
    private connectionStatusHandler: ConnectionStatusHandler = () => {};
  
    constructor(private url: string) {}
  
    // Connect to WebSocket
    connect() {
      // If there's already a connection, do nothing
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        return;
      }
  
      this.socket = new WebSocket(this.url);
  
      // Notify that connection is being established
      this.connectionStatusHandler("connecting");
  
      this.socket.onopen = () => {
        console.log("WebSocket connection established.");
        this.connectionStatusHandler("connected");
      };
  
      this.socket.onclose = () => {
        console.log("WebSocket connection closed.");
        this.connectionStatusHandler("disconnected");
      };
  
      this.socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        this.connectionStatusHandler("error");
      };
    }
  
    // Disconnect from WebSocket
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        this.connectionStatusHandler("disconnected");
      }
    }
  
    // Send a message through WebSocket
    sendMessage(message: WebSocketMessage) {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket is not open. Cannot send message.");
        this.connectionStatusHandler("disconnected");
      }
    }
  
    // Set a handler for incoming messages
    onMessage(handler: WebSocketMessageHandler) {
      if (!this.socket) {
        console.error("WebSocket is not connected.");
        return;
      }
  
      this.socket.onmessage = (event) => {
        try {
          const message: IncomingWebSocketData = JSON.parse(event.data);
  
          // Log response ID if the message is complete
          if (message.type === "complete") {
            console.log("Response complete with ID:", message.response_id);
          }
  
          // Pass the message to the provided handler
          handler(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  
    // Set a handler to listen for connection status changes
    setConnectionStatusHandler(handler: ConnectionStatusHandler) {
      this.connectionStatusHandler = handler;
    }
  }
  
  export default WebSocketService;
  