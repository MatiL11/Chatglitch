const express = require("express");
const handlebars = require("express-handlebars");
const router = require("./router/routes");
const { Server } = require("socket.io");

const port = 3000;
const app = express();
const messages = [];

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

router(app);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");

const httpServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = new Server(httpServer);

io.on("connection", socket => {
  console.log(`New client connected, id: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected, id: ${socket.id}`);
  });

  socket.on("newUser", user => {
    socket.broadcast.emit("userConnected", user);
    socket.emit("messageLogs", messages);
  });

  socket.on("message", data => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });
});
