export class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(0));
        this.hits = [];
        this.misses = [];
        this.ships = []
    }

    validatePlacement(ship, startX, startY, orientation) {
        if ((orientation === "vertical" && startX + ship.length > 10) ||
            (orientation === "horizontal" && startY + ship.length > 10) 
        ) throw new Error("Ship placement out of bounds");
    }

    calculatePositions(ship, startX, startY, orientation) {
        const positions = [];
        for (let i = 0; i < ship.length; i++) {
            const column = orientation === "vertical" ? startX + i : startX;
            const row = orientation === "horizontal" ? startY + i : startY;
            if (this.board[row][column]) {
                throw new Error("Another ship is already placed here");
            }
            positions.push({ row, column });
        }
        return positions;
    }

    placeShip(ship, startX, startY, orientation) {
        this.validatePlacement(ship, startX, startY, orientation);

        const positions = this.calculatePositions(ship, startX, startY, orientation);
        positions.forEach(({ row, column }) => {
            this.board[row][column] = ship;
        });

        this.ships.push(ship)
    }

    validateAttackCoords(coords) {
        if (this.hits.some(array => array.every((value,index) => value === coords[index])) || 
            this.misses.some(array => array.every((value,index) => value === coords[index]))
        ) throw new Error("Tile already clicked")

        if (coords.length !== 2 ||
            coords[0] > 9 || coords[0] < 0 ||
            coords[1] > 9 || coords[1] < 0
        ) throw new Error("Attack placement is invalid")
    }

    receiveAttack(attackCoordinates) {
        this.validateAttackCoords(attackCoordinates)

        const ship = this.board[attackCoordinates[1]][attackCoordinates[0]]
        if(ship) {
            ship.hit()
            this.hits.push(attackCoordinates)
        } else {
            this.misses.push(attackCoordinates)
        }
        return !!ship
    }

    allShipsSunk() {
        if (this.ships.length > 0) return this.ships.every(ship => ship.isSunk());
        return false
    }
}