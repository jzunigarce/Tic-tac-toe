
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io= require('socket.io')(http)
let board = [['', '', ''],
			['', '', ''],
			['', '', '']]
var contador=0
let movimientos = 0
let gameOver = false

app.use(express.static(__dirname));
app.get('/', function(req,res){
	res.sendFile(__dirname+'/gato.html');
});

const reset = function () {
	if(contador === 2) {
		board = [['', '', ''],
			['', '', ''],
			['', '', '']]
		contador = 0
		movimientos = 0
		gameOver = false
	}
	console.log('Usuario desconectado', contador);
}

const check = function (mov) {

	if((board[0][0] == mov && board[0][1] == mov && board[0][2] == mov) ||
		(board[1][0] == mov && board[1][1] == mov && board[1][2] == mov) || 
		(board[2][0] == mov && board[2][1] == mov && board[2][2] == mov) || 
		(board[0][0] == mov && board[1][0] == mov && board[2][0] == mov) || 
		(board[0][1] == mov && board[1][1] == mov && board[2][1] == mov) ||
		(board[0][2] == mov && board[1][2] == mov && board[2][2] == mov) ||
		(board[0][0] == mov && board[1][1] == mov && board[2][2] == mov) ||
		(board[2][0] == mov && board[1][1] == mov && board[0][2] == mov)) {
		return true

	} 
	return false
}

io.on('connection',function(socket){
	console.log('Usuario conectado'	);
	
	contador++
	if(contador > 2)
		return

	if(contador === 2)
		io.emit('ready',contador);
	let letra = contador == 1 ? 'x' : 'o'
	socket.emit('player', letra)
	
	socket.on('disconnect',reset);
	
	socket.on('move', function (pos) {
		if(board[pos.x][pos.y] === '' && !gameOver) {
			board[pos.x][pos.y] = pos.player
			console.log(board)
			let turno = pos.player === 'x' ? 'o' : 'x'
			io.emit('acepted', {p: pos.player, x: pos.x, y: pos.y, t: turno})
			movimientos++
			if(check(pos.player)) {
				gameOver = true
				io.emit('gameOver', `Ganó el jugador ${pos.player}`)
			} else if(movimientos === 9) {
				gameOver = true
				io.emit('gameOver', 'Juego en empate')
			}

		}
	})
});

http.listen(3000,function(){
	console.log('listening on *:3000');
});