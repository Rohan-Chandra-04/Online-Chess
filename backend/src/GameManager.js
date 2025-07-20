import { INIT_GAME, MOVE, GAME_OVER, WITH_DRAW } from "./messages.js";
import {Game} from "./Game.js"

export class GameManager{
    games= []
    users = []
    pendingUser;

    constructor(){
        this.games = [];
    }

    addUser(socket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket){
        this.users = this.users.filter(user => user!==socket);
        
        // Handle disconnection for games
        const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
        if (game) {
            game.handlePlayerDisconnection(socket);
            // Remove the game from active games
            this.games = this.games.filter(g => g !== game);
        }
        
        // Handle disconnection for pending user
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
    }

    addHandler (socket){
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("Received message:", message);
            if (message.type == INIT_GAME){
                if (this.pendingUser){
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }

            if (message.type == MOVE){
                console.log("if it is activated, our makeMove");
                const game = this.games.find(game => game.player1==socket || game.player2==socket);
                if (game){
                    console.log("Game found for move", message.payload);
                    game.makeMove(socket, message.payload);
                }
            }
        });

        // Handle socket disconnection
        socket.on("close", () => {
            console.log("Player disconnected");
            this.removeUser(socket);
        });

        // Handle socket errors
        socket.on("error", (error) => {
            console.log("Socket error:", error);
            this.removeUser(socket);
        });
    }

}