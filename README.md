# Multiplayer Game Lobby System README

## Overview

This project implements a basic backend system to manage game lobbies for a multiplayer game. It allows players to create lobbies, join and leave lobbies, and automatically starts a game when the lobby reaches a predetermined number of players. The system utilizes WebSockets for real-time communication between the server and clients, ensuring that players receive immediate updates about lobby status changes.

### Features

- **Lobby Management**: Create game lobbies with unique IDs, list all available game lobbies, and delete a lobby when the game starts or if it's empty.
- **Player Interaction**: Players can join or leave a game lobby.
- **Real-Time Updates**: All players in a lobby are notified in real-time about changes (players joining/leaving, game starting).

## Technical Stack

- **Backend Language**: Node.js
- **Real-Time Communication**: Socket.IO
- **Data Storage**: In-memory data structures

## Setup and Running

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Install all dependencies
   ```sh
   pip install express
   pip install socket.io

2. Run server.js
    ```sh
   node server.js

3. Open localhost:3000 in your browser and interact with it