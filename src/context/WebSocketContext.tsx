import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
  } from "react";
  import WebSocketService, {
    WebSocketMessage,
    IncomingWebSocketData,
  } from "@/service/websocket";
  import { v4 as uuidv4 } from "uuid";
  
  interface WebSocketContextType {
    isConnected: boolean;
    sendMessage: (message: WebSocketMessage) => void;
    onMessage: (handler: (data: IncomingWebSocketData) => void) => void;
  }
  
  const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
  );
  
  export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [wsService, setWsService] = useState<WebSocketService | null>(null);
    const [isConnected, setIsConnected] = useState(false);
  
    // Generate a unique session ID
    const sessionId = useMemo(() => {
      const storedSessionId = localStorage.getItem("sessionId");
      if (storedSessionId) {
        return storedSessionId;
      } else {
        const newSessionId = uuidv4();
        localStorage.setItem("sessionId", newSessionId);
        return newSessionId;
      }
    }, []);
  
    useEffect(() => {
      const service = new WebSocketService(
        `wss://server.ainucl.com/api/v1/ws/e63f8cef-5abd-471c-ba41-d660857ff174/chat/${sessionId}`
      );
  
      service.setConnectionStatusHandler((status) => {
        if (status === "connected") {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });
  
      service.connect();
      setWsService(service);
  
      return () => {
        service.disconnect();
      };
    }, [sessionId]);
  
    const sendMessage = (message: WebSocketMessage) => {
      if (wsService) {
        wsService.sendMessage(message);
      } else {
        console.warn("WebSocket is not connected.");
      }
    };
  
    const onMessage = (handler: (data: IncomingWebSocketData) => void) => {
      if (wsService) {
        wsService.onMessage(handler);
      } else {
        console.warn("WebSocket is not connected.");
      }
    };
  
    return (
      <WebSocketContext.Provider value={{ isConnected, sendMessage, onMessage }}>
        {children}
      </WebSocketContext.Provider>
    );
  };
  
  export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
      throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
  };
  