function connectSocket(io){
    io.on('connection', socket => {
        console.log('new connection ', socket.id); 
        socket.emit('message', `server CAROTA say Hello!!!`);
        
		socket.on('disconnect', () => console.log('disconnected')); 
	})
}

module.exports = connectSocket