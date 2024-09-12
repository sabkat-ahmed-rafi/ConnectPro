# ConnectPro

**ConnectPro** is a real-time chat application designed to provide seamless messaging, audio, and video call functionalities. Built using **Socket.IO** for real-time communication, **WebRTC** for video/audio calls, and a tech stack including **Node.js**, **Express**, **React**, and **MongoDB**, this project enables users to connect in a modern, dynamic chat environment.

## Features

- **Real-Time Messaging**: Chat with friends instantly using Socket.IO.
- **Audio & Video Calls**: Connect with others through high-quality audio and video powered by WebRTC.
- **User Authentication**: Secure login and registration system.
- **Responsive UI**: Designed with a mobile-first approach, works seamlessly across all devices.
- **Dynamic Inbox**: See your message history and conversation list with live updates.
- **Call Timer**: Displays call duration during audio/video calls.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.IO
- **Audio/Video**: WebRTC

## Current Challenge

While **ConnectPro** works perfectly within a local network, there is a limitation with the **TURN server** configuration when trying to support audio and video calls over wider networks. Currently, the project uses a free community TURN server, which is not fully reliable for all network environments. This may cause the video/audio calls to fail or perform poorly across different networks.

### Next Steps

- **Upgrade to a paid or self-hosted TURN server**: To improve connectivity and ensure the app works across various networks, I’m exploring better TURN server options. This upgrade will enable more robust video and audio calls without the current network limitations.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sabkat-ahmed-rafi/connectpro.git
   cd connectpro
