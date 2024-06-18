import { buildBoard, getShipsToPlace, updateBoard } from './modules';

export function buildPlayerBoardPlacer(player1) {
    document.addEventListener('DOMContentLoaded', () => {
        const board = document.querySelector('.player.board');
        const rotateDirection = document.getElementById("rotate-direction");
        const rotateBtn = document.getElementById("rotate");

        buildBoard(board);
        setupRotateButton(rotateDirection, rotateBtn);
        setupShipPlacementListener(board, player1, rotateDirection);
    });
}

function setupRotateButton(rotateDirection, rotateBtn) {
    rotateBtn.addEventListener('click', () => {
        rotateDirection.textContent = (rotateDirection.textContent === "Horizontal") ? "Vertical" : "Horizontal";
    });
}

function setupShipPlacementListener(board, player, rotateDirection) {
    const startBtn = document.getElementById("start");


    let currentShipIndex = 0;

    const boardListener = (event) => {
        const position = event.target.getAttribute("data-position");
        const [x, y] = position.split(',').map(Number);
        const currentShip = getShipsToPlace(player)[currentShipIndex];

        if (getShipsToPlace(player).length > currentShipIndex) {
            try {
                currentShip.addShip(x, y, rotateDirection.textContent.toLowerCase());
                updateBoard(board, player.gameboard);
                currentShipIndex++;
            } catch (error) {
                alert(error.message);
            }
        }

        if(player.gameboard.ships.length === 5) {
            startBtn.style.visibility = "visible";
            board.removeEventListener('click', boardListener)
        }
    };

    board.addEventListener('click', boardListener);
}