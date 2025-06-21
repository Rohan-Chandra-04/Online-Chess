import React, { useState, useEffect } from 'react';
import { ChessBoard } from '../components/ChessBoard';
import { INIT_GAME, MOVE, GAME_OVER } from '../utils/messages';
import { useSocket } from '../hooks/useSocket';
import { Button } from '../components/Button';
import { Chess } from 'chess.js';

function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME: {
          const newGame = new Chess();
          setChess(newGame);
          setBoard(newGame.board());
          setPlayerColor(message.payload.color);
          console.log('Game initialized');
          break;
        }

        case MOVE: {
          const move = message.payload;
          if (message.payload.error) {
            alert(`Error: ${message.payload.error}`);
            return;
          }
          const updated = chess.move(move);
          if (updated) {
            setBoard(chess.board());
            console.log('Move applied:', move);
          } else {
            console.warn('Illegal move received:', move);
          }
          break;
        }

        case GAME_OVER:
          console.log('Game over:', message.data);
          break;

        default:
          console.warn('Unknown message type:', message.type);
      }
    };
  }, [socket, chess]);

  if (!socket) {
    return (
      <div className="flex justify-center items-center bg-gray-700 h-screen">
        <div className="text-white text-2xl">Connecting to the game...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-700 h-screen">
      <div className="pt-5 max-w-screen-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <ChessBoard board={board} socket={socket} chess={chess} setBoard={setBoard} playerColor={playerColor}/>
          </div>
          <div>
            <Button
              onClick={() => {
                socket.send(JSON.stringify({ type: INIT_GAME }));
              }}
            >
              Play Now!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
