import { generateRandom } from "./modules"

const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.board-container.computer');
const results = document.querySelector(".results")
let playerClickListener = null

export function handlePlayerTurn(player, computer) {
    results.textContent = "Player's Turn!"

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
                results.textContent = "Computer's Turn!"
                setTimeout(() => { handleComputerTurn(player, computer); }, 1000) //swap turn
            } else {
                event.target.classList.add("hit")
                event.target.textContent = "X"
                checkIfHitSinks(computer, "computer", x, y)
                if (computer.gameboard.allShipsSunk()) finishedGame("Player", computerBoard, playerClickListener)
            }
        } catch (err) {
            results.textContent = "Tile already clicked!"
        }
    };
    
    computerBoard.addEventListener('click', playerClickListener);
}

function handleComputerTurn(player, computer) {
    let value = generateRandom()
    let x = value[0];
    let y = value[1];

    const position = document.querySelector(`[data-position='${x},${y}']`)

    try {
        if (!player.gameboard.receiveAttack([x, y])) {
            position.classList.add("miss")
            position.textContent = "O"
            handlePlayerTurn(player, computer); //swap turn
        } else {
            position.classList.add("hit")
            position.textContent = "X"
            setTimeout(() => { handleComputerTurn(player, computer); }, 1000) //keep going the same turn
            checkIfHitSinks(player, "player", x, y)
            if (player.gameboard.allShipsSunk()) finishedGame("Computer", playerBoard,)
        }
    } catch (err) {
        if (err.message === "Tile already clicked") handleComputerTurn(player, computer)
    }
}

function finishedGame(winner, board, clickListener) {
    const restartBtn = document.getElementById("restart")

    board.removeEventListener('click', clickListener)
    results.textContent = winner + " wins!"
    restartBtn.textContent = "New Game"
}

function checkIfHitSinks(player, name, x, y) {
    let board = player.gameboard.board
    let ship = board[y][x]
    let finished = 0

    if (!ship.isSunk()) return

    //check horizontal
    for (let i = Math.max(0, y-(ship.length - 1)); i < y + ship.length; i++) {
        if (board[i][x] === ship) {
            document.querySelector(`.${name}.board [data-position='${x},${i}']`).classList.add("sunk")
            finished++
        }
    }

    if (finished === ship.length) return

    //check vertical
    for (let i = Math.max(0, x-(ship.length - 1)); i < x + ship.length; i++) {
        if (board[y][i] === ship) document.querySelector(`.${name}.board [data-position='${i},${y}']`).classList.add("sunk")
    }
}