import { useState, useEffect } from 'react';

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;
    console.log('Connecting to WebSocket with token:', token);
    const ws = new WebSocket(`ws://localhost:3000?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  return socket;
};
