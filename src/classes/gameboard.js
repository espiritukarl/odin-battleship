export class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(0));
        this.hits = [];
        this.misses = [];
        this.ships = []
    }

    validatePlacement(ship, startX, startY, orientation) {
        if (startX < 0 || startX > 9 ||
            startY < 0 || startY > 9 ||
            (orientation === "vertical" && startX + ship.length > 10) ||
            (orientation === "horizontal" && startY + ship.length > 10) 
        ) {
            throw new Error("Ship placement out of bounds");
        }
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

    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    receiveAttack(attackCoordinates) {
        const x = attackCoordinates[0] 
        const y = attackCoordinates[1] 

        if(
            this.hits.some(array => this.arraysEqual(array, attackCoordinates)) || 
            this.misses.some(array => this.arraysEqual(array, attackCoordinates))
        ) throw new Error("Tile already clicked")

        if (attackCoordinates.length !== 2 ||
            x > 9 || x < 0 ||
            y > 9 || y < 0
        ) throw new Error("Attack placement is invalid")

        const ship = this.board[y][x]
        if(ship) {
            ship.hit()
            this.hits.push(attackCoordinates)
            return true
        } else {
            this.misses.push(attackCoordinates)
            return false
        }
    }

    allShipsSunk() {
        if (this.ships.length > 0) return this.ships.every(ship => ship.isSunk());
        return false
    }
}