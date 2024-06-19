import { Gameboard } from './gameboard'
import { Ship } from './ship'

export class Player {
    constructor() {
        this.gameboard = new Gameboard()
    }

    addShip(length, startX, startY, orientation) {
        let ship = (() => {
            switch(length) {
                case 5:
                    return new Ship("Aircraft Carrier", 5);
                case 4:
                    return new Ship("Battleship", 4);
                case 3:
                    return new Ship("Destroyer", 3);
                case 2:
                    return new Ship("Submarine", 3);
                case 1:
                    return new Ship("Cruiser", 2);
            } 
        })();
        this.gameboard.placeShip(ship, startX, startY, orientation)
    }

    restart() {
        this.gameboard = new Gameboard()
    }
}