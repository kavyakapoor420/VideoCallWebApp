//This imports the Server class from the socket.io package. 
// Server is used to create a WebSocket server for handling real-time communication.
import {Server} from 'socket.io'

//Declaring Variables to Manage Connections and Messages
let connections={}    //This object stores all the connected sockets grouped by "rooms" (call paths in this case). Each room will contain an array of socket IDs representing all the users in that room.
let messages={};     //This object stores the messages sent in each room. The messages are stored as an array of objects, where each object represents a single message with its sender and other details.     
let timeOnline={}    // This object tracks the time when a socket (user) connects to the server, which is used to calculate the duration the user was online.

// connectToSocket is a function that initializes the Socket.io server on top of an existing HTTP server (server).
// or it is a function  that accepts an HTTP server (e.g., an Express server) and initializes a Socket.io server using that HTTP server.
// The cors configuration here ensures that the WebSocket server allows cross-origin requests. This is important 
// when the front-end and back-end are hosted on different domains.
export const connectToSocket=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"*" , // or u can url of your frontend
            methods:['GET','POST'],
            allowedHeeaders:["*"],
            credentials:true
        }
    })
    //io.on("connection", ...) listens for incoming WebSocket connections from clients. When a client connects, it emits a connection event, and the provided callback function is executed.
//The socket object represents the connected client and allows interaction with that particular client.
io.on('connection',(socket)=>{
    console.log('user connected',socket.id)
    //join-call event 
    socket.on("join-call", (path) => {
        if (connections[path] === undefined) {
            connections[path] = [];
        }
        connections[path].push(socket.id);
        timeOnline[socket.id] = new Date();
            //socket.on("join-call", (path)): This listens for a join-call event from a client. When a client wants to join a room (a "call"), they emit this event with a path (the room's unique identifier).
            //The code checks if the room (connections[path]) exists. If it doesn't, it initializes an empty array to store socket IDs.
            //The client’s socket ID (socket.id) is added to the list of connected clients in that room.
            //timeOnline[socket.id] = new Date(); tracks the time when this client joined the room.
 
           // After the client joins the room, the server notifies all other users already in the room (connections[path]) that a new user has joined.
         //io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]): For each socket ID in the room, the server sends the user-joined event, informing the other clients of the new user's ID and the current state of the connections in the room.
      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
      }
      //Sending previous messages (if any)

     if (messages[path] !== undefined) {
    for (let a = 0; a < messages[path].length; ++a) {
        io.to(socket.id).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender']);
     }
   } 
})

   // If the room has any stored messages (from a previous session), the server sends these messages to the new client.
    //It loops through the stored messages and sends each one using the chat-message event. The data, sender, and socket-id-sender are sent so that the client knows the message content, sender, and the sender's socket ID.
   
    //"signal" event
    socket.on("signal", (toId, message) => {
        io.to(toId).emit("signal", socket.id, message);
    });
    //signal is commonly used in WebRTC (Web Real-Time Communication) applications to send signaling data (such as ICE candidates or session descriptions) between peers.
    //The server listens for signal events, which are emitted by clients, and forwards the signaling message to the specified recipient (toId).
    

    //chat-message event
    socket.on("chat-message", (data, sender) => {
        const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue]) => {
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true];
                }
                return [room, isFound];
            }, ['', false]);
    
        if (found === true) {
            if (messages[matchingRoom] === undefined) {
                messages[matchingRoom] = [];
            }
            messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id });
            console.log("message", matchingRoom, ":", sender, data);
    
            connections[matchingRoom].forEach((elem) => {
                io.to(elem).emit("chat-message", data, sender, socket.id);
            });
        }
    });

    //chat-message: This listens for chat-message events from clients, where they send a message (and a sender identifier).
    //It then finds which room (if any) the current socket belongs to by checking all the rooms in connections. This is done using reduce, which finds the room where the current socket ID exists.
    //If the room is found, the message is stored in the messages object for that room.
    //The message is then broadcast to all other connected clients in that room, including the sender, by emitting the chat-message event.


    //disconnect event
    socket.on("disconnect", () => {
        var diffTime = Math.abs(timeOnline[socket.id] - new Date());
        var key;
    
        for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
            for (let a = 0; a < v.length; ++a) {
                if (v[a] === socket.id) {
                    key = k;
                    for (let a = 0; a < connections[key].length; ++a) {
                        io.to(connections[key][a]).emit('user-left', socket.id);
                    }
                    var index = connections[key].indexOf(socket.id);
                    connections[key].splice(index, 1);
    
                    if (connections[key].length === 0) {
                        delete connections[key];
                    }
                }
            }
        }
    });
   // disconnect: This listens for when a client disconnects.
    //When a socket disconnects, the server calculates how long the client was online by subtracting the time they connected (timeOnline[socket.id]) from the current time.
    //The server then checks all the rooms (connections) and removes the socket from the room where it was located.
    //For each client still in the room, a user-left event is emitted, notifying them of the disconnection.
    //If the room becomes empty after the user disconnects (i.e., no remaining sockets in the room), the room is deleted from connections.
    

   //    Returning the Socket.IO server instance

    return io;
    //Finally, the function returns the io instance (the Socket.IO server), which is responsible for handling real-time communication.
})  
}


// Summary
//This function sets up a real-time WebSocket server using socket.io that allows clients to:

//Join a "call" (room) and broadcast that to other connected clients.
//Send chat messages to other users in the same room.
//Exchange signaling messages (typically used in WebRTC for peer-to-peer communication).
//Disconnect and notify other users of their departure, cleaning up rooms as needed.
//It handles connections, room management, message broadcasting, and disconnections while tracking the users' online time.


//The code sets up a Socket.io server to handle real-time communication for 
// a system with multiple "calls" (rooms).
//It handles events like joining a call (join-call), sending signals 
// for peer-to-peer communication (signal), sending chat messages (chat-message), and handling disconnections (disconnect).
//It tracks users in each room and maintains the message history 
// for each room. When a user joins, they are sent any previous messages in the room, and when a user disconnects, others in the room are notified.
