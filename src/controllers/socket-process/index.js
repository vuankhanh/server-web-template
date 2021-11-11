const refreshTheRemainingAmount = require('./refreshTheRemainingAmout');

function connectSocket(io){
    io.on('connection', socket => {
        console.log('new connection ', socket.id);
        socket.emit('message', `server CAROTA say Hello!!!`);
        refreshTheRemainingAmount(socket);
		socket.on('disconnect', () => console.log('disconnected')); 
	});
}

module.exports = connectSocket