import { generateRandom, targetMovement, addVectors, isOutOfRange } from "./modules"

const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.board-container.computer');
const results = document.querySelector(".results")
const computerDelay = 1
let playerClickListener = null
let queue = []
let computerTargetMode = false

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
                playerBoard.classList.remove("dim")
                computerBoard.classList.add("dim")
                results.textContent = "Computer's Turn!"
                setTimeout(() => { handleComputerTurn(player, computer); }, computerDelay) 
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

    if (!computerTargetMode) queue = [[x,y]]

    try {
        let currentCoord = queue.shift()
        const position = document.querySelector(`[data-position='${currentCoord[0]},${currentCoord[1]}']`)

        if (player.gameboard.receiveAttack(currentCoord)) {
            position.classList.add("hit")
            position.textContent = "X"
            computerTargetMode = true
            if (checkIfHitSinks(player, "player", currentCoord[0], currentCoord[1])) {
                computerTargetMode = false
                queue = []
                if (player.gameboard.allShipsSunk()) finishedGame("Computer", playerBoard,)
                else setTimeout(() => { handleComputerTurn(player, computer); }, computerDelay)
            } else {
                targetMovement.forEach(move => {
                    let newPos = addVectors(currentCoord, move)
                    if (!isOutOfRange(newPos) && !player.gameboard.misses.some(array => array.every((value) => value === newPos))){
                        queue.push(newPos)
                    }
                })
                setTimeout(() => { handleComputerTurn(player, computer); }, computerDelay)
            }
        } else {
            position.classList.add("miss")
            handlePlayerTurn(player, computer); //swap turn
        }
    } catch (err) {
        if (err.message === "Tile already clicked") handleComputerTurn(player, computer)
    }
}

function finishedGame(winner, board, clickListener) {
    queue = []
    const restartBtn = document.getElementById("restart")

    board.removeEventListener('click', clickListener)
    results.textContent = winner + " wins!"
    restartBtn.textContent = "New Game"
}

function checkIfHitSinks(player, name, x, y) {
    if (!player.gameboard.board[y][x].isSunk()) return false

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (player.gameboard.board[j][i] === player.gameboard.board[y][x]) 
                document.querySelector(`.${name}.board [data-position='${i},${j}']`).classList.add("sunk")
        }
    }
    results.textContent = `${player.gameboard.board[y][x].name} has been sunk!`
    return true
}