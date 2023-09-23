const express = require("express");
const app = express();
const server = app.listen(4000, () => console.log("Server is on Port 4000!"));

const io = require("socket.io")(server);

app.use(express.static("public"));

let socketsConnected = new Set()

io.on("connection", onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit("clients-total", socketsConnected.size)

    socket.on("disconnect", () => {
        console.log("Socket disconnected",socket.id)
        socketsConnected.delete(socket.id)
        io.emit("clients-total", socketsConnected.size)
    });

    socket.on("message", (data)=>{
        console.log(data);
        socket.broadcast.emit("chat-message", data)
    })

    socket.on("feedback", (data)=>{
        socket.broadcast.emit("feedback", data)
    })
}