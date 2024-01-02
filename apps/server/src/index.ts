import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";

async function init() {
  startMessageConsumer();
  const socketService = new SocketService();

  const httpServer = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://scalable-chat-web.vercel.app/"); // Replace '*' with your frontend's URL
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  });
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () =>
    console.log(`HTTP server started at PORT: ${PORT}`)
  );

  socketService.initListeners();
}

init();
