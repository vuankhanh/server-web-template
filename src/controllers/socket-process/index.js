const jwtHelper = require('../../middleware/AuthMiddleware');

const refreshTheRemainingAmount = require('./refreshTheRemainingAmout');

function connectSocketNonSecure(io){
    io.on('connection', socket => {
        socket.emit('message', `server CAROTA say Hello!!!`);
        refreshTheRemainingAmount(socket);
		// socket.on('disconnect', () => console.log('disconnected'));
	});
}

function connectSocketSecure(io){
    io.use((socket, next)=>{
        jwtHelper.checkSecureSocket(socket, next);
    });
    io.on('connection', socket => {
        socket.emit('message', `server CAROTA say Hello!!!`);
		// socket.on('disconnect', () => console.log('disconnected'));
	});
}

module.exports = {
    connectSocketNonSecure,
    connectSocketSecure
}