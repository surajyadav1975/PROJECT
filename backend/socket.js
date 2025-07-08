const { Server } = require('socket.io');

let onlineUsers = {};

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('⚡ New user connected:', socket.id);

    // socket.onAny((event, ...args) => {
    //     console.log(`📡 Event received: ${event}`, args);
    // });

    socket.on('user-online', (userId) => {
      onlineUsers[socket.id] = userId;
      console.log(`User ${userId} is online`);
      io.emit('update-online-users', Object.values(onlineUsers));
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      delete onlineUsers[socket.id];
      io.emit('update-online-users', Object.values(onlineUsers));
    });

    socket.on('send-invite', ({ fromUserId, toUserId}) => {
      console.log(`📨 Invite sent from ${fromUserId} to ${toUserId}`);
      const targetSocketId = Object.keys(onlineUsers).find(key => onlineUsers[key] === toUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit('receive-invite', { fromUserId});
      }
    });


    socket.on('accept-invite', ({ fromUserId, toUserId}) => {
      const fromSocketId = Object.keys(onlineUsers).find(key => onlineUsers[key] === fromUserId);
      
      if (fromSocketId) {
        const currid=socket.id;
        const roomId = `${fromSocketId}-${socket.id}`;

        socket.join(roomId);

        io.to(fromSocketId).emit('invite-accepted', { roomId, a:fromSocketId, b:currid});
        socket.emit('invite-accepted', { roomId, a:currid ,b:fromSocketId});

        console.log(`🎉 Room ${roomId} created`);
      }
    });
    socket.on('decline-invite', ({ fromUserId, toUserId}) => {
      const fromSocketId = Object.keys(onlineUsers).find(key => onlineUsers[key] === fromUserId);
      
      if (fromSocketId) {
        const currid=socket.id;
        const roomId = `${fromSocketId}-${socket.id}-${problemId}`;

        socket.join(roomId);

        io.to(fromSocketId).emit('invite-rejected', { roomId, a:fromSocketId, b:currid});
        socket.emit('invite-rejected', { roomId, a:currid ,b:fromSocketId});

        console.log(`🎉 Room ${roomId} created`);
      }
    });

    socket.on('code-change', ({ tosocketid, code }) => {
        // console.log(tosocketid);
        if (tosocketid) {
            io.to(tosocketid).emit('receive-code', { code });
        }
    });
  });
}

module.exports = { setupSocket };