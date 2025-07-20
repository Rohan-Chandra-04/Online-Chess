import {Chess} from "chess.js"
import {GAME_OVER, INIT_GAME, MOVE, WITH_DRAW} from "./messages.js"

export class Game{
    player1;
    player2;
    board ;
    startTime;
    moveCount;

    constructor(player1, player2){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.moveCount = 0;

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'w'
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'b'
            }
        }));
        console.log('game initiated....');
    }

    handlePlayerDisconnection(disconnectedSocket) {
        console.log("Player disconnected, handling game termination");
        
        // Determine which player disconnected and notify the remaining player
        if (this.player1 === disconnectedSocket) {
            // Player 1 disconnected, notify player 2
            if (this.player2 && this.player2.readyState === 1) { // Check if socket is still open
                this.player2.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: "You won! Your opponent disconnected.",
                        reason: "opponent_disconnected"
                    }
                }));
            }
            this.player1 = null;
        } else if (this.player2 === disconnectedSocket) {
            // Player 2 disconnected, notify player 1
            if (this.player1 && this.player1.readyState === 1) { // Check if socket is still open
                this.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: "You won! Your opponent disconnected.",
                        reason: "opponent_disconnected"
                    }
                }));
            }
            this.player2 = null;
        }
    }

    makeMove(socket, move){
        console.log("received move", move);

        // Check if either player has disconnected
        if (this.player1 === null) {
            if (this.player2 && this.player2.readyState === 1) {
                this.player2.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: "You won! Your opponent disconnected.",
                        reason: "opponent_disconnected"
                    }
                }));
            }
            return;
        }

        if (this.player2 === null) {
            if (this.player1 && this.player1.readyState === 1) {
                this.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner: "You won! Your opponent disconnected.",
                        reason: "opponent_disconnected"
                    }
                }));
            }
            return;
        }

        if (this.moveCount % 2 === 0 && this.player1 !== socket){
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: {
                    error: "It's not your turn!"
                }
            }));
            return;
        }

        if (this.moveCount % 2 === 1 && this.player2 !== socket){
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: {
                    error: "It's not your turn!"
                }
            }));
            return;
        }

        try{
            this.board.move(move);
        }catch(e){
            console.log(e);
            return;
        }

        if (this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type : GAME_OVER,
                payload: {
                    winner : this.board.turn() === "w" ? "black" : "white",
                    reason: "checkmate_or_stalemate"
                }
            }))

            this.player2.send(JSON.stringify({
                type : GAME_OVER,
                payload: {
                    winner : this.board.turn() === "w" ? "black" : "white",
                    reason: "checkmate_or_stalemate"
                }
            }))
            return;
        }

        
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))

        this.moveCount++;
    }
}
