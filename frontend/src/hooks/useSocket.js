import {useState, useEffect} from 'react';
const WS_URL = 'ws://localhost:8080';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
        const newSocket = new WebSocket(WS_URL); 

        newSocket.onopen = () => {
            console.log('WebSocket connection established');
            console.log('coooool')
            setSocket(newSocket);
        };

        newSocket.onclose = () => {
            console.log('very sad');
            console.log('WebSocket connection closed');
            setSocket(null);
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        
        return () => {
            newSocket.close();
        };
    }, []);
    
    return socket;
}
