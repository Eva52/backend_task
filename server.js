// Install necessary dependencies: express, socket.io

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// In-memory storage for game lobbies and players
const lobbies = new Map();
const players = new Map();

function* genrateID() {
    let id = 0;
    while (true) {
      yield id++;
    }
}
const generator = genrateID();

// Event listeners for socket.io connections
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    // list all lobbies initially
    socket.on('getLobby', () => {
        io.emit('lobbyListUpdated', Array.from(lobbies.values()));
    });

    // Player joins a lobby
    socket.on('joinLobby', (lobbyId, playerId) => {
        lobbyId=parseInt(lobbyId)
        if (lobbies.has(lobbyId)) {
            const lobby = lobbies.get(lobbyId);
            if(!players.has(playerId) || players.get(playerId)==false){
                lobby.players.push(playerId);
                players.set(playerId, true);
                socket.join(lobbyId);
                if(lobby.players.length<3){
                    io.to(lobbyId).emit('lobbyUpdated', Array.from(lobbies.values()));
                    console.log(`Player ${playerId} joined lobby ${lobbyId}`);
                }
                else{
                    io.to(lobbyId).emit('gameStarted', lobby);
                    lobbies.delete(lobbyId);
                    console.log(`Game started in lobby ${lobbyId}`);
                }
            }
        } else {
            socket.emit('error', 'Lobby not found');
        }
    });

    // Player leaves a lobby
    socket.on('leaveLobby', (lobbyId, playerId) => {
        lobbyId=parseInt(lobbyId)
        if (lobbies.has(lobbyId)) {
            const lobby = lobbies.get(lobbyId);
            lobby.players = lobby.players.filter(function(item) {
                return item !== playerId
            })
            players.set(playerId, false);
            io.to(lobbyId).emit('lobbyUpdated', Array.from(lobbies.values()));
            socket.leave(lobbyId);
            console.log(`Player ${playerId} left lobby ${lobbyId}`);
        } else {
            socket.emit('error', 'Lobby not found');
        }
    });

    // Create a lobby
    socket.on('createLobby', (playerId, lobbyDetails) => {
        const lobbyId = generator.next().value; // Generate a lobby ID
        if(!players.has(playerId) || players.get(playerId)==false){
            lobbies.set(lobbyId, { id: lobbyId, players: [], details: lobbyDetails });
            //socket.join(lobbyId);
            io.emit('lobbyListUpdated', Array.from(lobbies.values())); // Notify all clients about the new lobby
            console.log(`Player ${playerId} created lobby ${lobbyId}`);
        }
    });

    // Start the game
    socket.on('startGame', (lobbyId) => {
        lobbyId=parseInt(lobbyId)
        if (lobbies.has(lobbyId)) {
            const lobby = lobbies.get(lobbyId);
            io.to(lobbyId).emit('gameStarted', lobby);
            lobbies.delete(lobbyId);
            console.log(`Game started in lobby ${lobbyId}`);
        } else {
            socket.emit('error', 'Lobby not found');
        }
    });
});

// API endpoints for interacting with the system
app.get('/', (req, res) => {
    res.sendFile('D:/backend_task/views/index.html')
});

app.post('/joinLobby', (req, res) => {
    // Implementation for joining a lobby via HTTP API
});

app.post('/leaveLobby', (req, res) => {
    // Implementation for leaving a lobby via HTTP API
});

app.post('/startGame', (req, res) => {
    // Implementation for starting a game via HTTP API
});

// Run the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
