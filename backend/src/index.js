import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager.js';
import { createClerkClient } from '@clerk/backend';
import jwt from 'jsonwebtoken';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const app = express();
const port = 3000;

const wss = new WebSocketServer({ port });
console.log('WebSocket server is running on ws://localhost:3000');
const gameManager = new GameManager();

wss.on('connection', async (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  const secret = process.env.CLERK_SECRET_KEY;
  console.log('connection attempt with token:', token);
  if (!token) {
    ws.close(1008, 'No token provided');
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['RS256'] });
    //const userId = session.userId;

    console.log('Authenticated user:', decoded);
    gameManager.addUser(ws);

    ws.on('close', () => {
      gameManager.removeUser(ws);
    });

  } catch (error) {
    console.error('Invalid token:', error);
    ws.close(1008, 'Invalid authentication');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
