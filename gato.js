const socket = io();
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
ctx.font = "bold 120px sans-serif";
const size = 100
// const board = [['', '', ''],
// 			['', '', ''],
// 			['', '', '']]
const canvasL = canvas.offsetLeft
const canvasT = canvas.offsetTop
let turno = 'x';
let player = '';
let movimientos = 0
let gameOver = false

const drawBoard = function () {
	ctx.beginPath()
	ctx.strokeStyle = "#46ddb0" 
	ctx.lineWidth = 5
	
	//Horizontal
	for(let i = 1; i <= 2; i ++) {
		ctx.moveTo(0, size * i)
		ctx.lineTo(size * 3,  size * i)
	}

	//Vertical
	for(let i = 1; i <= 2; i ++) {
		ctx.moveTo(size * i, 0)
		ctx.lineTo(size * i, size * 3)
	}

	ctx.stroke()
}

const drawMov = function (x, y) {
	socket.emit('move', {x: x, y: y, player: player})
}

const checkTurno = function () {
	return player === turno
}

const game = function (event) {
	if (!gameOver && checkTurno()) {
		let x = event.pageX - canvasL
		let y = event.pageY - canvasT

		if((x >= 0 && x < size - 5) && (y >= 0 && y < size- 5)) {
			drawMov(0, 0)
		} else if((x >= size && x < size * 2 - 5) && (y >= 0 && y < size- 5)) {
			drawMov(1, 0)
		} else if((x >= size * 2 && x < size * 3 - 5) && (y >= 0 && y < size- 5)) {
			drawMov(2, 0)
		} else if((x >= 0 && x < size - 5) && (y >= size && y < size * 2 - 5)) {
			drawMov(0, 1)
		} else if((x >= size && x < size * 2 - 5) && (y >= size && y < size * 2 - 5)) {
			drawMov(1, 1)
		} else if((x >= size * 2 && x < size * 3 - 5) && (y >= size && y < size * 2 - 5)) {
			drawMov(2, 1)
		}else if((x >= 0 && x < size - 5) && (y >= size * 2 && y < size * 3 - 5)) {
			drawMov(0, 2)
		} else if((x >= size && x < size * 2 - 5) && (y >= size * 2 && y < size * 3 - 5)) {
			drawMov(1, 2)
		} else if((x >= size * 2 && x < size * 3 - 5) && (y >= size * 2 && y < size * 3 - 5)) {
			drawMov(2, 2)
		}
	}
}

drawBoard()
socket.on('ready', function () {
	canvas.addEventListener('click', game)
})

socket.on('player', function (p) {
	player = p;
})

socket.on('acepted', function (a){
	ctx.fillStyle = a.p === 'x' ? '#01bBC2' : '#f1be32'
	ctx.fillText(a.p,20 + (size * a.x),80 + (size * a.y));
	turno = a.t
})

socket.on('gameOver', function (result){
	gameOver = true
	alert(result)
})
