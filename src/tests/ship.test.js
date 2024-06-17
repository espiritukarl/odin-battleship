import { Ship } from '../classes/ship'

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship("Destroyer", 3); // Create a new ship with length 3 before each test
    });

    test('initializes ship', () => {
        expect(ship.name).toBe("Destroyer")
        expect(ship.length).toBe(3);
        expect(ship.hits).toBe(0);
    });

    test('hit() increments hits if ship is not sunk', () => {
        ship.hit();
        expect(ship.hits).toBe(1);
        ship.hit();
        expect(ship.hits).toBe(2);
    });

    test('hit() does not increment hits if ship is already sunk', () => {
        ship.hit();
        ship.hit();
        ship.hit(); // Sinks the ship
        ship.hit(); // Try to hit again
        expect(ship.hits).toBe(3); // Hits should still be 3
    });

    test('isSunk() returns false if hits are less than length', () => {
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('isSunk() returns true if hits are equal to or greater than length', () => {
        ship.hit();
        ship.hit();
        ship.hit(); // Sinks the ship
        expect(ship.isSunk()).toBe(true);
    });
});