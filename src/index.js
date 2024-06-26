import _ from 'lodash'
import './style.css' 
import { Player } from './classes/player'
import { buildPlayerBoardPlacer } from './dom_manipulation/boardPlayer'
import { buildComputerBoard } from './dom_manipulation/boardComputer';
import { handlePlayerTurn } from './dom_manipulation/gameStart';

const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart")
const computerSection = document.querySelector(".board-container.computer")
const rotateDirection = document.getElementById("rotate-direction");
const rotateBtn = document.getElementById("rotate");
const randomBtn = document.getElementById("randomize");
const board = document.querySelector('.player.board');
const player = new Player();
const computer = new Player();


// Function to set up player board and event listeners
function initializeGame() {
    buildPlayerBoardPlacer(player);
    board.classList.remove("dim")
    startBtn.classList.remove("hide");
    rotateDirection.classList.remove("hide");
    rotateBtn.classList.remove("hide");
    randomBtn.classList.remove("hide");
    restartBtn.classList.add("hide");

    startBtn.addEventListener("click", startGame);
}

// Function to handle game start
function startGame() {
    buildComputerBoard(computer);
    handlePlayerTurn(player, computer);

    // Hide and show appropriate buttons
    startBtn.classList.add("hide");
    rotateDirection.classList.add("hide");
    rotateBtn.classList.add("hide");
    randomBtn.classList.add("hide");
    restartBtn.classList.remove("hide");

    restartBtn.textContent = "Restart"

    // Remove the event listener to avoid duplication
    startBtn.removeEventListener("click", startGame);
}

// Function to handle game restart
restartBtn.addEventListener("click", () => {
    player.restart();
    computer.restart();
    board.innerHTML = '';
    computerSection.innerHTML = "";
    document.querySelector(".results").textContent = ""

    initializeGame();
});

// Initial game setup
initializeGame();

// -- 1. Computer hidden ships --
// -- 2. X when miss; O when hit --
// -- 3. Styling --
// 4. Refactor hiding buttons
// 5. Refactor validation of placements (put it inside computer)
// 6. Refactor tests
// 7. Create test for Player
// -- 8. On hover, show ship --