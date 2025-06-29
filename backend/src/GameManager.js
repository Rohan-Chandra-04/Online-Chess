import { INIT_GAME, MOVE } from "./messages.js";
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
        })
    }

}