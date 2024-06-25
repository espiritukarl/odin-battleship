import { generateRandom } from "./modules"

const playerBoard = document.querySelector('.player.board');
const computerBoard = document.querySelector('.board-container.computer');
const results = document.querySelector(".results")
let playerClickListener = null
let computerHasNotHit = true
let prevAttackMissed = false
let origX, origY, newX, newY
let direction = "left"

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

    //Computer hit a boat before this
    if (!computerHasNotHit) {
        x = newX
        y = newY
        console.log(x, y, direction)
    }

    const position = document.querySelector(`[data-position='${x},${y}']`)

    try {
        if (!player.gameboard.receiveAttack([x, y])) {
            position.classList.add("miss")
            prevAttackMissed = true
            // smartComputer(player, x, y)
            handlePlayerTurn(player, computer); //swap turn
        } else {
            position.classList.add("hit")
            position.textContent = "X"
            if (computerHasNotHit) {
                origX = x
                origY = y
                direction = "left"
            }
            prevAttackMissed = false
            smartComputer(player,x,y)
            checkIfHitSinks(player, "player", x, y)
            setTimeout(() => { handleComputerTurn(player, computer); }, 1) //keep going the same turn
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
    if (!player.gameboard.board[y][x].isSunk()) return

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (player.gameboard.board[j][i] === player.gameboard.board[y][x]) 
                document.querySelector(`.${name}.board [data-position='${i},${j}']`).classList.add("sunk")
        }
    }

    results.textContent = `${player.gameboard.board[y][x].name} has been sunk!`
}

function smartComputer(player, x, y) {
    function left() {
        if (JSON.stringify(player.gameboard.misses).includes(JSON.stringify([y-1,x])) && 
            (prevAttackMissed || y-1 < 0)) {
            direction = "right"
            newX = origX
            newY = origY
        } else if (prevAttackMissed || JSON.stringify(player.gameboard.misses).includes(JSON.stringify([y-1,x]))) {
            newX = origX
            newY = origY
            direction = "up"
        }  else {
            newX = x
            newY = y-1
        }
    }

    function up() {
        if (JSON.stringify(player.gameboard.misses).includes(JSON.stringify([y,x-1])) &&
            (prevAttackMissed || x-1 < 0)) {
            direction = "down"
            newX = origX
            newY = origY
        } else if (prevAttackMissed || JSON.stringify(player.gameboard.misses).includes(JSON.stringify([y,x-1]))) {
            newX = origX
            newY = origY
            direction = "right"
        } else {
            newX = x-1
            newY = y
        }
    }

    function right() {
        if (y+1 < 9) {
            direction = "down"
        } else if (prevAttackMissed || JSON.stringify(player.gameboard.misses).includes(JSON.stringify([y+1,x]))) {
            newX = origX
            newY = origY
            direction = "down"
        } else {
            newX = x
            newY = y+1
        }
    }

    function down() {
        newX = x+1
        newY = y
    }

    if (direction === "left") left()
    else if (direction === "right") right()
    else if (direction === "up") up()
    else if (direction === "down") down()

    computerHasNotHit = player.gameboard.board[y][x].isSunk()

}

/*
    Left:
        go left
            if attack misses
                change position to original
                change direction to up
            if left is in array of misses
                change direction to right
            if shink sunk
                stop
            if we moved && (left is in array of misses || out of bounds)
                change position to original, 
                change direction right
            if we havent moved && left is out of bounds
                direction to up
            if hit
                keep going left

    Up:
        if up out of bounds 
        change direction to right            

        go up
            if attack misses
                change position to original
                change direction to right
            if up is in array of misses
                change direction to right
                go right
            if hit
                keep going up
                if shink sunk
                    stop
                if miss || if up is in array of misses || out of bounds
                    change position to original
                    change direction to down

    Right:
        if right out of bounds 
        change direction to down            

        go right
            if attack misses
                change position to original
                change direction to down
            if right is in array of misses
                change direction to down
                go down
            if hit
                keep going right
                if ship sunk
                    stop

    Down:   
        go down
            keep going down
                if ship sunk
                    stop

*/