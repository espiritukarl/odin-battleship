import _ from 'lodash'
import './style.css' 
import { Player } from './classes/player'
import { buildPlayerBoardPlacer } from './dom_manipulation/boardCreationPlayer'
import { buildComputerBoard } from './dom_manipulation/boardCreationComputer';
import { gameStart } from './dom_manipulation/gameStart';

const startBtn = document.getElementById("start");
const player = new Player();
const computer = new Player();


buildPlayerBoardPlacer(player)
startBtn.addEventListener("click", () => {
    buildComputerBoard(computer)
    gameStart(player, computer)
})