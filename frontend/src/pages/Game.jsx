import React, { useState, useEffect } from 'react';
import { ChessBoard } from '../components/ChessBoard';
import { INIT_GAME, MOVE, GAME_OVER, WITH_DRAW } from '../utils/messages';
import { Button } from '../components/Button';
import { Chess } from 'chess.js';
import { useAuth } from '@clerk/clerk-react';
import { useSocket } from '../hooks/useSocket';

function Game() {
  const { getToken } = useAuth(); 
  const [token, setToken] = useState(null);
  //const [socket, setSocket] = useState(null);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState(null);
  const [captured, setCaptured] = useState([]);

  // 1. Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      const t = await getToken();
      console.log('Fetched token:', t);
      setToken(t);
    };
    fetchToken();
  }, [getToken]);

  const socket = useSocket(token);

  // 3. Socket message handler
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
          break;
        }
        case MOVE: {
          const move = message.payload;
          if (move.error) {
            alert(`Error: ${move.error}`);
            return;
          }
          const moveMade = chess.move(move);
          if (moveMade) {
            if (moveMade.captured) {
              setCaptured((prev) => [...prev, `${moveMade.color}_${moveMade.captured}`]);
            }
            setBoard(chess.board());
          }
          break;
        }
        case GAME_OVER:
          console.log('Game over:', message.data);
          break;
        case WITH_DRAW:
          console.log('Opponent resigned');
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
      <div className="pt-5 w-full">
        <div className="flex flex-col md:flex-row w-full">
          <div className="w-1/2 h-screen border-b">
            <ChessBoard
              board={board}
              socket={socket}
              chess={chess}
              setBoard={setBoard}
              playerColor={playerColor}
            />
          </div>
          <div className="w-1/2 p-12">
            <Button
              onClick={() => {
                socket.send(JSON.stringify({ type: INIT_GAME }));
              }}
            >
              {playerColor ? `Your ${playerColor} King!` : 'Play Now!'}
            </Button>
            <div className="captured-pieces w-full flex flex-wrap">
              <h3 className="mt-6 text-4xl"> Captured Pieces : </h3>
              {captured.map((piece, i) => (
                <div key={`${piece}-${i}`} className="p-8 w-1/8">
                  <img src={`${piece}.png`} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
