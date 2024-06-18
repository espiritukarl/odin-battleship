export function buildBoard(board) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
            square.dataset.position = `${i},${j}`;
            board.appendChild(square);
        }
    }
}

export function updateBoard(board, gameboard) {
    const squares = board.querySelectorAll('.square');
    squares.forEach(square => {
        const [x, y] = square.dataset.position.split(',').map(Number);
        const ship = gameboard.board[y][x];
        if (ship) {
            square.classList.add(ship.name.replace(/\s+/g, '-').toLowerCase());
        }
    });
}

export function generateRandom() {
    const randomX = Math.floor(Math.random() * 10); // Random number between 0 and 9
    const randomY = Math.floor(Math.random() * 10); // Random number between 0 and 9
    const orientation = Math.random() < 0.5 ? "horizontal" : "vertical"; // Randomly select "horizontal" or "vertical"
    
    return [randomX, randomY, orientation];
}

export function getShipsToPlace(player) {
    return [
        { name: 'Aircraft Carrier', length: 5, addShip: (x, y, orientation) => player.addAircraftCarrier(x, y, orientation) },
        { name: 'Battleship', length: 4, addShip: (x, y, orientation) => player.addBattleship(x, y, orientation) },
        { name: 'Destroyer', length: 3, addShip: (x, y, orientation) => player.addDestroyer(x, y, orientation) },
        { name: 'Submarine', length: 3, addShip: (x, y, orientation) => player.addSubmarine(x, y, orientation) },
        { name: 'Cruiser', length: 2, addShip: (x, y, orientation) => player.addCruiser(x, y, orientation) },
    ];
}