import { buildBoard, updateBoard, lengths, randomizeShipPlacement } from './modules';

let currentShipIndex = 0;
let boardListener = null;
const board = document.querySelector('.player.board');

export function buildPlayerBoardPlacer(player1) {
    const rotateDirection = document.getElementById("rotate-direction");
    const rotateBtn = document.getElementById("rotate");

    buildBoard(board);
    setupRotateButton(rotateDirection, rotateBtn);
    setupShipPlacementListener(board, player1, rotateDirection.textContent);
    randomShipPlacementListener(player1, board)
}

function setupRotateButton(rotateDirection, rotateBtn) {
    rotateBtn.addEventListener('click', () => {
        rotateDirection.textContent = (rotateDirection.textContent === "Horizontal") ? "Vertical" : "Horizontal";
    });
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
            board.removeEventListener('click', boardListener)
            currentShipIndex = 0
        }
    };

    board.addEventListener('click', boardListener);
}

function randomShipPlacementListener(player1, board) {
    const randomBtn = document.getElementById("randomize");

    const randomize = randomBtn.addEventListener("click", () => {
        randomizeShipPlacement(player1, board, currentShipIndex, true)
        board.removeEventListener('click', boardListener);
        randomBtn.removeEventListener('click', randomize)
        currentShipIndex = 0
    })
}