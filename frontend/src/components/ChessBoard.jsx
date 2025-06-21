import React, { useState, useEffect } from 'react';
import {MOVE} from '../utils/messages';

export const ChessBoard = ({ board, socket, chess, setBoard, playerColor }) => {
  const [from, setFrom] = useState(null);
  //const [waiting, setWaiting] = useState(false);
  const [captured, setCaptured] = useState([]);
  const [legalMoves, setLegalMoves] = useState([]);

  const handleClick = (squareNotation) => {
    //if (chess.turn() !== playerColor) return;

    if (!from) {
      const piece = chess.get(squareNotation);
      if (!piece || piece.color !== playerColor || chess.turn() !== playerColor) return;

      setFrom(squareNotation);
      const moves = chess.moves({ square: squareNotation, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
    } else {
      const move = { from, to: squareNotation };

      // chess.move(move);
      // setBoard(chess.board());
      console.log('sending move:', move);
      socket.send(JSON.stringify({ type: MOVE, payload: move }));

      setFrom(null);
      setLegalMoves([]);
      //setWaiting(true);
    }
  };


  return (
    <div className="chessboard-container">
      <div className="captured-pieces">
        {captured.map((p, i) => (
          <span key={i} className="captured-piece">{p}</span>
        ))}
      </div>
      <div className="chessboard">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((square, colIndex) => {
              const squareNotation =
                String.fromCharCode(97 + colIndex) + (8 - rowIndex);

              const isSelected = from === squareNotation;
              const isLegal = legalMoves.includes(squareNotation);

              return (
                <div
                  key={colIndex}
                  onClick={() => handleClick(squareNotation)}
                  className={`w-16 h-16 flex items-center justify-center cursor-pointer square-transition
                    ${((rowIndex + colIndex) % 2 === 0) ? 'bg-gray-200' : 'bg-blue-900'}
                    ${isSelected ? 'bg-yellow-300' : ''}
                    ${isLegal ? 'ring-2 ring-green-500' : ''}`}
                >
                  {square ? (
                    <span className="text-2xl piece">
                      {/* {square.color === 'w'
                        ? square.type.toUpperCase()
                        : square.type.toLowerCase()} */}
                        <img src={`${square.color}_${square.type}.png`} alt={square.type}/>
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
