import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      socket.on('join-room', ({ meetingId }) => {
        if (!meetingId) return;
        socket.join(meetingId);
        const room = io.sockets.adapter.rooms.get(meetingId);
        const participants = room ? [...room] : [];

        // notify counts
        io.to(meetingId).emit('participants', { count: participants.length });

        // pick initiator (lowest socket id) when at least 2
        if (participants.length >= 2) {
          const sorted = [...participants].sort();
          const initiator = sorted[0];
          sorted.forEach((id) => {
            io.to(id).emit('ready', { initiator: id === initiator });
          });
        }
      });

      socket.on('offer', ({ meetingId, description }) => {
        if (meetingId && description) {
          socket.to(meetingId).emit('offer', { description });
        }
      });

      socket.on('answer', ({ meetingId, description }) => {
        if (meetingId && description) {
          socket.to(meetingId).emit('answer', { description });
        }
      });

      socket.on('ice-candidate', ({ meetingId, candidate }) => {
        if (meetingId && candidate) {
          socket.to(meetingId).emit('ice-candidate', { candidate });
        }
      });

      socket.on('leave-room', ({ meetingId }) => {
        if (meetingId) {
          socket.leave(meetingId);
          socket.to(meetingId).emit('peer-left');
        }
      });

      socket.on('disconnect', () => {
        // nothing extra
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
