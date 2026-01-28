socket.on('join-room', room => socket.join(room));
socket.on('input', data => io.to(room).emit('remote-input', { user: socket.id, data }));
// Colored cursors via xterm addon
