import { buildBoard, updateBoard, lengths, randomizeShipPlacement } from './modules';

const board = document.querySelector('.player.board');
const rotateBtn = document.getElementById("rotate");

let currentShipIndex = 0;
let boardListener = null;
let hoverBoardListener = null
let hoverOffBoardListener = null
let rotateListener = null

export function buildPlayerBoardPlacer(player) {
    const rotateDirection = document.getElementById("rotate-direction");

    buildBoard(board)
    setupRotateButton(rotateDirection, player)
    hoverShipPlacement(board, rotateDirection.textContent)
    setupShipPlacementListener(board, player, rotateDirection.textContent);
    randomShipPlacementListener(player, board)
}

function setupRotateButton(rotateDirection, player) {
    rotateListener = () => {
        endListeners()
        rotateDirection.textContent = (rotateDirection.textContent === "Horizontal") ? "Vertical" : "Horizontal";
        hoverShipPlacement(board, rotateDirection.textContent)
        setupShipPlacementListener(board, player, rotateDirection.textContent);
    }

    rotateBtn.addEventListener('click', rotateListener)
}

function setupShipPlacementListener(board, player, rotateDirection) {
    const startBtn = document.getElementById("start");

    startBtn.disabled = true

    boardListener = (event) => {
        const position = event.target.getAttribute("data-position");
        const [x, y] = position.split(',').map(Number);

        try {
            player.addShip(lengths[currentShipIndex], x, y, rotateDirection.toLowerCase())
            updateBoard(board, player.gameboard);
            currentShipIndex++;
        } catch (error) {
            alert(error.message);
        }

        if(player.gameboard.ships.length === 5) {
            startBtn.disabled = false
            rotateBtn.removeEventListener('click', rotateListener)
            endListeners()
            currentShipIndex = 0
        }
    };

    board.addEventListener('click', boardListener);
}

function randomShipPlacementListener(player, board) {
    const randomBtn = document.getElementById("randomize");

    randomBtn.addEventListener("click", () => {
        randomizeShipPlacement(player, board, currentShipIndex, true)
        rotateBtn.removeEventListener('click', rotateListener)
        endListeners()
        currentShipIndex = 0
    })
}

function hoverShipPlacement(board, rotateDirection) {
    let ship = ["Aircraft Carrier", "Battleship", "Destroyer", "Submarine", "Cruiser"]
    let classShipNames = ship.map(shipName => shipName.replace(/\s+/g, '-').toLowerCase())
    let shipLenghts = [5, 4, 3, 3, 2]

    hoverBoardListener = (event) => {
        const [x, y] = event.target.dataset.position.split(',').map(Number);
        let position = document.querySelector(`[data-position='${x},${y}']`)

        for (let i = 0; i < shipLenghts[currentShipIndex]; i++) {
            position = rotateDirection.toLowerCase() === "horizontal" ? document.querySelector(`[data-position='${x},${y+i}']`) : document.querySelector(`[data-position='${x+i},${y}']`)
            if (position) {
                if (!Array.from(position.classList).some(className => classShipNames.includes(className))) position.classList.add(classShipNames[currentShipIndex]) 
            }
        }

        if (currentShipIndex === 5) {
            rotateBtn.removeEventListener('click', rotateListener)
            endListeners()
        }
    }

    hoverOffBoardListener = (event) => {
        const [x, y] = event.target.dataset.position.split(',').map(Number);
        let position = document.querySelector(`[data-position='${x},${y}']`)

        for (let i = 0; i < shipLenghts[currentShipIndex]; i++) {
            position = rotateDirection.toLowerCase() === "horizontal" ? document.querySelector(`[data-position='${x},${y+i}']`) : document.querySelector(`[data-position='${x+i},${y}']`)
            if (position) position.classList.remove(classShipNames[currentShipIndex]) 
        }
    }

    board.addEventListener('mouseout', hoverOffBoardListener)
    board.addEventListener('mouseover', hoverBoardListener);
}

function endListeners() {
    board.removeEventListener('click', boardListener);
    board.removeEventListener('mouseover', hoverBoardListener);
    board.removeEventListener('mouseout', hoverOffBoardListener);
}

