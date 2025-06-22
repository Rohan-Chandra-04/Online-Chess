import React, { useState, useEffect } from 'react';
import {MOVE} from '../utils/messages';

export const ChessBoard = ({ board, socket, chess, setBoard, playerColor }) => {
  const [from, setFrom] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);

  const handleClick = (squareNotation) => {
    
    if (!from) {
      const piece = chess.get(squareNotation);
      if (!piece || piece.color !== playerColor || chess.turn() !== playerColor) return;

      setFrom(squareNotation);
      const moves = chess.moves({ square: squareNotation, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
    } else {
      const move = { from, to: squareNotation };

      console.log('sending move:', move);
      socket.send(JSON.stringify({ type: MOVE, payload: move }));

      setFrom(null);
      setLegalMoves([]);
    }
  };


  return (
    <div className="chessboard-container ">
      
      <div className=" w-full pt-12 pl-24">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-full">
            {row.map((square, colIndex) => {
              const squareNotation =
                String.fromCharCode(97 + colIndex) + (8 - rowIndex);

              const isSelected = from === squareNotation;
              const isLegal = legalMoves.includes(squareNotation);

              return (
                <div
                  key={colIndex}
                  onClick={() => handleClick(squareNotation)}
                  className={`w-1/10 aspect-square flex items-center justify-center cursor-pointer square-transition
                    ${((rowIndex + colIndex) % 2 === 0) ? 'bg-gray-200' : 'bg-blue-900'}
                    ${isSelected ? 'bg-yellow-300' : ''}
                    ${isLegal ? 'ring-2 ring-green-500' : ''}`}
                >
                  {square ? (
                    <div className='flex items-center justify-center'>
                      <img src={`${square.color}_${square.type}.png`} alt={square.type} className="w-1/2"/>
                    </div>

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
