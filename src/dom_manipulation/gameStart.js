import { generateRandom } from "./modules"

const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.board-container.computer');
let playerClickListener = null

export function handlePlayerTurn(player, computer) {
    playerBoard.classList.add("dim")
    computerBoard.classList.remove("dim")

    if (playerClickListener) computerBoard.removeEventListener('click', playerClickListener);

    playerClickListener = (event) => {
        const [x, y] = event.target.dataset.position.split(',').map(Number);

        try {
            if (!computer.gameboard.receiveAttack([x, y])) {
                computerBoard.removeEventListener('click', playerClickListener);
                event.target.classList.add("miss")
                event.target.textContent = "O"
                playerBoard.classList.remove("dim")
                computerBoard.classList.add("dim")
                setTimeout(() => {
                    handleComputerTurn(player, computer);
                }, 1000)
            } else if (computer.gameboard.allShipsSunk()) {
                event.target.classList.add("hit")
                event.target.textContent = "X"
                finishedGame("Player", computerBoard, playerClickListener)
            } else {
                event.target.classList.add("hit")
                event.target.textContent = "X"
                checkIfHitSinks(computer, "computer", x, y)
            }
        } catch (err) {
            alert(err.message); 
        }
    };
    
    computerBoard.addEventListener('click', playerClickListener);
}

function handleComputerTurn(player, computer) {
    let value = generateRandom()
    const x = value[0]
    const y = value[1]
    const position = document.querySelector(`[data-position='${x},${y}']`)

    try {
        if (!player.gameboard.receiveAttack([x, y])) {
            position.classList.add("miss")
            position.textContent = "O"
            handlePlayerTurn(player, computer);
        } else if (player.gameboard.allShipsSunk()) {
            position.classList.add("hit")
            position.textContent = "X"
            finishedGame("Computer", playerBoard,)
        } else {
            position.classList.add("hit")
            position.textContent = "X"
            handleComputerTurn(player, computer)
            checkIfHitSinks(player, "player", x, y)
        }
    } catch (err) {
        alert(err.message); 
    }
}

function finishedGame(winner, board, clickListener) {
    const results = document.querySelector(".results")
    const restartBtn = document.getElementById("restart")

    board.removeEventListener('click', clickListener)
    results.textContent = winner + " wins!"
    restartBtn.textContent = "New Game"
}

function checkIfHitSinks(player, name, x, y) {
    if (player.gameboard.board[y][x].isSunk()) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (player.gameboard.board[j][i] === player.gameboard.board[y][x]) 
                    document.querySelector(`.${name}.board [data-position='${i},${j}']`).classList.add("sunk")
            }
        }
    }
}