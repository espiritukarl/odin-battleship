export function gameStart(player, computer) {
    const playerBoard = document.querySelector('.player.board');
    const computerBoard = document.querySelector('.board-container.computer');

    handlePlayerTurn(player, computer, playerBoard, computerBoard);
}

function handlePlayerTurn(player, computer, playerBoard, computerBoard) {
    const playerClickListener = (event) => {
        const position = event.target.getAttribute("data-position");
        const [x, y] = position.split(',').map(Number);

        try {
            if (!computer.gameboard.receiveAttack([x, y])) {
                computerBoard.removeEventListener('click', playerClickListener);
                handleComputerTurn(player, computer, playerBoard, computerBoard);
            } else {
                if (computer.gameboard.allShipsSunk()) {
                    computerBoard.removeEventListener('click', playerClickListener);
                    console.log("Player wins!");
                }
            }
        } catch (err) {
            alert(err.message); 
        }
    };
    
    computerBoard.addEventListener('click', playerClickListener);
}

function handleComputerTurn(player, computer, playerBoard, computerBoard) {
    const computerClickListener = (event) => {
        const position = event.target.getAttribute("data-position");
        const [x, y] = position.split(',').map(Number);

        try {
            if (!player.gameboard.receiveAttack([x, y])) {
                playerBoard.removeEventListener('click', computerClickListener);
                handlePlayerTurn(player, computer, playerBoard, computerBoard);
            } else {
                if (player.gameboard.allShipsSunk()) {
                    playerBoard.removeEventListener('click', computerClickListener);
                    console.log("Computer wins!");
                }
            }
        } catch (err) {
            alert(err.message); 
        }
    };

    playerBoard.addEventListener('click', computerClickListener);
}