// src/messages/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessagesService } from "./messages.service";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  /** 
   * When a new socket connects, do nothing here because
   * we will wait until the client explicitly calls "join".
   */
  handleConnection(client: Socket) {
    // (no-op)
  }

  /**
   * When the client emits "join", we make that socket join a room named after the userId.
   * Now any server‐emitted event to that room will be delivered to this socket.
   */
  @SubscribeMessage("join")
  handleJoin(client: Socket, payload: { userId: string }) {
    client.join(payload.userId);
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    client: Socket,
    data: { senderId: string; recipientId: string; content: string }
  ) {
    // 1) Persist the message
    const message = await this.messagesService.create(data);

    // 2) Emit to the recipient’s room:
    this.server.to(data.recipientId).emit("newMessage", message);

    // 3) Also re‐emit to the sender’s room so the sender sees confirmations in real time
    this.server.to(data.senderId).emit("newMessage", message);

    return message;
  }

  @SubscribeMessage("typing")
  handleTyping(client: Socket, data: { from: string; to: string }) {
    // Simply broadcast “typing” to the `to` room
    this.server.to(data.to).emit("typing", { from: data.from });
  }
}
