import { Server } from "socket.io";
import { Redis } from "ioredis";
import { log } from "console";
import prismaClient from "./prisma";
import  {produceMessage} from "./kafka";

const pub = new Redis({
  host: "redis-6b15312-sawairohan90-8203.a.aivencloud.com",
  port: 12096,
  username: "default",
  password: "AVNS_Au8knoCxbJNsNA_65pt",
});
const sub = new Redis({
  host: "redis-6b15312-sawairohan90-8203.a.aivencloud.com",
  port: 12096,
  username: "default",
  password: "AVNS_Au8knoCxbJNsNA_65pt",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listners...");
    io.on("connect", (socket) => {
      console.log("New Socket Connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
        console.log("new message from redis", message);
        await produceMessage(message);
        console.log("message produced to Kafka Broker");
        
      }
    });
  }
  public initListners() {}
  get io() {
    return this._io;
  }
}

export default SocketService;
