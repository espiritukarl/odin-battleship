import { buildBoard, generateRandom, getShipsToPlace, updateBoard } from "./modules"

export function buildComputerBoard(computer) {
    const computerSection = document.querySelector(".board-container.computer")
    const computerBoard = document.createElement("div")
    const h2 = document.createElement("h2")
    const startBtn = document.getElementById("start");
    const rotateDirection = document.getElementById("rotate-direction");
    const rotateBtn = document.getElementById("rotate");


    computerBoard.classList.add("computer", "board")

    buildBoard(computerBoard)

    h2.textContent = "Computer"
    computerSection.append(h2)
    computerSection.append(computerBoard)    

    let currentShipIndex = 0;

    while(computer.gameboard.ships.length < 5) {
        let value = generateRandom()
        const x = Number(value[0])
        const y = Number(value[1])
        const direction = value[2]

        const currentShip = getShipsToPlace(computer)[currentShipIndex];
        try {
            currentShip.addShip(x, y, direction);
            updateBoard(computerBoard, computer.gameboard);
            currentShipIndex++;
        } catch (error) {
        }
    }

    startBtn.classList.toggle("hide")
    rotateDirection.classList.add("hide")
    rotateBtn.classList.add("hide")
}