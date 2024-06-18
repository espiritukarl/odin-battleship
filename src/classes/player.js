import { Gameboard } from './gameboard'
import { Ship } from './ship'

export class Player {
    constructor() {
        this.gameboard = new Gameboard()
    }

    addAircraftCarrier(startX, startY, orientation) {
        const aircraftCarrier = new Ship("Aircraft Carrier", 5);
        this.gameboard.placeShip(aircraftCarrier, startX, startY, orientation);
    }

    addBattleship(startX, startY, orientation) {
        const battleship = new Ship("Battleship", 4);
        this.gameboard.placeShip(battleship, startX, startY, orientation);
    }

    addDestroyer(startX, startY, orientation) {
        const destroyer = new Ship("Destroyer", 3);
        this.gameboard.placeShip(destroyer, startX, startY, orientation);
    }

    addSubmarine(startX, startY, orientation) {
        const submarine = new Ship("Submarine", 3);
        this.gameboard.placeShip(submarine, startX, startY, orientation);
    }

    addCruiser(startX, startY, orientation) {
        const cruiser = new Ship("Cruiser", 2);
        this.gameboard.placeShip(cruiser, startX, startY, orientation);
    }
}