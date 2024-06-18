import { Gameboard } from '../classes/gameboard'
import { Ship } from '../classes/ship'

describe('Gameboard', () => {
    let gameboard;
    let destroyer;

    beforeEach(() => {
        gameboard = new Gameboard();
        destroyer = new Ship("Destroyer", 3);
    });

    test('validatePlacement throws error for out of bounds coordinates', () => {
        expect(() => gameboard.validatePlacement(destroyer, -1, 0, 'horizontal')).toThrow("Ship placement out of bounds");
        expect(() => gameboard.validatePlacement(destroyer, 0, 10, 'vertical')).toThrow("Ship placement out of bounds");
    });

    test('calculatePositions returns correct positions for horizontal orientation', () => {
        const positions = gameboard.calculatePositions(destroyer, 0, 0, 'vertical');
        expect(positions).toEqual([{ row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }]);
    });

    test('calculatePositions returns correct positions for vertical orientation', () => {
        const positions = gameboard.calculatePositions(destroyer, 0, 0, 'horizontal');
        expect(positions).toEqual([{ row: 0, column: 0 }, { row: 1, column: 0 }, { row: 2, column: 0 }]);
    });

    test('placeShip throws error if positions are occupied', () => {
        gameboard.board[0][0] = 'ship';
        expect(() => gameboard.calculatePositions(destroyer, 0, 0, 'horizontal')).toThrow("Another ship is already placed here");
    });


    test('placeShip throws error if positions are occupied', () => {
        gameboard.board[0][0] = 'ship';
        expect(() => gameboard.placeShip(destroyer, 0, 0, 'horizontal')).toThrow("Another ship is already placed here");
    });

    test('placeShip updates board with ship positions', () => {
        gameboard.placeShip(destroyer, 0, 0, 'vertical');
        expect(gameboard.board[0][0]).toBe(destroyer);
        expect(gameboard.board[0][1]).toBe(destroyer);
        expect(gameboard.board[0][2]).toBe(destroyer);
    });

    test('receiveAttack throws error for invalid attack placement', () => {
        expect(() => gameboard.receiveAttack(destroyer, [0])).toThrow("Attack placement is invalid");
        expect(() => gameboard.receiveAttack(destroyer, [0, 1, 2])).toThrow("Attack placement is invalid");
        expect(() => gameboard.receiveAttack(destroyer, [10, 10])).toThrow("Attack placement is invalid");
    });

    test('receiveAttack hits the ship if attack coordinates match ship position', () => {
        const attackCoordinates = [0, 0];
        gameboard.board[0][0] = destroyer; // Place the ship at attack coordinates
        const originalHits = destroyer.hits;
        
        gameboard.receiveAttack(attackCoordinates);
        
        expect(destroyer.hits).toBe(originalHits + 1); // Check if ship's hits increased by 1
    });

    test('receiveAttack does not hit the ship if attack coordinates do not match ship position', () => {
        const attackCoordinates = [0, 0];
        const otherShip = new Ship("Other Ship", 3);
        gameboard.board[0][0] = otherShip; // Place another ship at attack coordinates
        const originalHits = destroyer.hits;
        
        gameboard.receiveAttack(attackCoordinates);
        
        expect(destroyer.hits).toBe(originalHits); // Check if ship's hits remain unchanged
    });

    test('allShipsSunk returns true when all ships are sunk', () => {
        // Create some ships and sink them
        const ships = [
            new Ship("Cruiser", 2), // Length: 2
            new Ship("Destroyer", 3), // Length: 3
            new Ship("Battleship", 4)  // Length: 4
        ];

        //sink ship 1
        ships[0].hit()
        ships[0].hit()
        //sink ship 2
        ships[1].hit()
        ships[1].hit()
        ships[1].hit()
        //sink ship 3
        ships[2].hit()
        ships[2].hit()
        ships[2].hit()
        ships[2].hit()

        gameboard.ships = ships;

        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test('allShipsSunk returns false when not all ships are sunk', () => {
        // Create some ships and sink only some of them
        const ships = [
            new Ship("Cruiser", 2), // Length: 2
            new Ship("Destroyer", 3), // Length: 3
            new Ship("Battleship", 4)  // Length: 4
        ];

        // Sink some ships partially
        ships[0].hit();
        ships[1].hit();
        ships[1].hit();
        ships[2].hit();

        gameboard.ships = ships;

        expect(gameboard.allShipsSunk()).toBe(false);
    });

    test('allShipsSunk returns false when there are no ships', () => {
        // No ships on the gameboard
        expect(gameboard.allShipsSunk()).toBe(false);
    });
});