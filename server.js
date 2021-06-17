const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("io", io);

app.use(express.static("public"));

const productsRouter = require("./routes/products.routes");
app.use("/api", productsRouter);

const messagesRouter = require("./routes/messages.routes");
app.use("/api", messagesRouter);

io.on("connect", (socket) => {
  console.log("usuario conectado");
});

const puerto = 8080;

http.listen(puerto, () => {
  console.log(`servidor escuchando en http://localhost:${puerto}`);
});

http.on("error", (error) => {
  console.log("error en el servidor:", error);
});
