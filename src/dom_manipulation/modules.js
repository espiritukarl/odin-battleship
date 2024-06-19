export function buildBoard(board) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
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

export const lengths = [5, 4, 3, 2, 1]

export function randomizeShipPlacement(player, board, index, isComputer) {
    const startBtn = document.getElementById("start");

    while(player.gameboard.ships.length < 5) {
        let value = generateRandom()
        const x = Number(value[0])
        const y = Number(value[1])
        const direction = value[2]

        try {
            player.addShip(lengths[index], x, y, direction)
            if (isComputer) updateBoard(board, player.gameboard);
            index++;
        } catch (error) {
        }
    }

    if (isComputer) startBtn.disabled = false
}