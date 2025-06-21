import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager.js';

const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket server is running on ws://localhost:8080');
const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  console.log('New client connected');
  gameManager.addUser(ws);

  ws.on("disconnect", ()=> gameManager.removeUser(ws))
});