import { buildBoard, randomizeShipPlacement } from "./modules"

export function buildComputerBoard(computer) {
    const computerSection = document.querySelector(".board-container.computer")
    const computerBoard = document.createElement("div")
    const h2 = document.createElement("h2")
    const startBtn = document.getElementById("start");
    const rotateDirection = document.getElementById("rotate-direction");
    const rotateBtn = document.getElementById("rotate");
    const randomBtn = document.getElementById("randomize");
    const restartBtn = document.getElementById("restart")

    computerBoard.classList.add("computer", "board")

    buildBoard(computerBoard)

    h2.textContent = "Computer"
    computerSection.append(h2)
    computerSection.append(computerBoard)    

    let currentShipIndex = 0;

    randomizeShipPlacement(computer, computerBoard, currentShipIndex, false)

    startBtn.classList.toggle("hide")
    rotateDirection.classList.toggle("hide")
    rotateBtn.classList.toggle("hide")
    randomBtn.classList.toggle("hide")
    restartBtn.classList.toggle("hide")
}