export class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.misses = [];
        this.ships = []
    }

    validatePlacement(ship, startX, startY, orientation) {
        if (startX < 0 || startX > 9 ||
            startY < 0 || startY > 9 ||
            (orientation === "horizontal" && startX + ship.length > 10) ||
            (orientation === "vertical" && startY + ship.length > 10)
        ) {
            throw new Error("Ship placement out of bounds");
        }
    }

    calculatePositions(ship, startX, startY, orientation) {
        const positions = [];
        for (let i = 0; i < ship.length; i++) {
            const column = orientation === "horizontal" ? startX + i : startX;
            const row = orientation === "vertical" ? startY + i : startY;
            positions.push({ row, column });
        }
        return positions;
    }

    checkOccupiedPositions(positions) {
        for (const { row, column } of positions) {
            if (this.board[row][column] !== null) {
                return this.board[row][column]; 
            }
        }
        return false; 
    }

    placeShip(ship, startX, startY, orientation) {
        this.validatePlacement(ship, startX, startY, orientation);

        const positions = this.calculatePositions(ship, startX, startY, orientation);

        if (this.checkOccupiedPositions(positions)) {
            throw new Error("Another ship is already placed here");
        }

        positions.forEach(({ row, column }) => {
            this.board[row][column] = ship;
        });
        
        this.ships.push(ship)
    }

    receiveAttack(attackCoordinates) {
        const x = attackCoordinates[0] 
        const y = attackCoordinates[1] 

        if (attackCoordinates.length !== 2 ||
            x > 9 || x < 0 ||
            y > 9 || y < 0
        ) throw new Error("Attack placement is invalid")

        const ship = this.board[y][x]
        if(ship) ship.hit()
        else this.misses.push(attackCoordinates)
    }

    allShipsSunk() {
        if (this.ships.length > 0) return this.ships.every(ship => ship.isSunk());
        return false
    }
}