import { generateRandom, targetMovement, addVectors, isOutOfRange } from "./modules"

const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.board-container.computer');
const results = document.querySelector(".results")
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
                event.target.textContent = "O"
                //swap turn
                playerBoard.classList.remove("dim")
                computerBoard.classList.add("dim")
                results.textContent = "Computer's Turn!"
                setTimeout(() => { handleComputerTurn(player, computer); }, 1) 
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

    if (!computerTargetMode) queue = [[x,y]]

    try {
        let currentCoord = queue.shift()
        if (player.gameboard.receiveAttack(currentCoord)) {
            position.classList.add("hit")
            position.textContent = "X"
            computerTargetMode = true
            if (checkIfHitSinks(player, "player", x, y)) {
                computerTargetMode = false
                setTimeout(() => { handleComputerTargeter(player, computer); }, 1)
                if (player.gameboard.allShipsSunk()) finishedGame("Computer", playerBoard,)
            } else {
                targetMovement.forEach(move => {
                    let newPos = addVectors(currentCoord, move)
                    if (!isOutOfRange && player.gameboard.hits.some(array => array.every((value) => value === currentCoord))) queue.push(newPos)
                })
                setTimeout(() => { handleComputerTargeter(player, computer); }, 1)
            }
        } else {
            position.classList.add("miss")
            position.textContent = "O"
            handlePlayerTurn(player, computer); //swap turn
        }

        // if (!player.gameboard.receiveAttack([x, y])) {
        //     position.classList.add("miss")
        //     position.textContent = "O"
        //     handlePlayerTurn(player, computer); //swap turn
        // } else {
        //     position.classList.add("hit")
        //     position.textContent = "X"
        //     setTimeout(() => { handleComputerTargeter(player, computer); }, 1) //keep going the same turn
        //     // if (player.gameboard.allShipsSunk()) finishedGame("Computer", playerBoard,)
        // }
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