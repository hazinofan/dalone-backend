// src/messages/messages.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { Message, MessageSchema } from "./schemas/message.schema";
import { ChatGateway } from "./chat.gateway";
import { Conversation, ConversationSchema } from "./schemas/conversations.schema";
import { ConversationsService } from "./conversations.service";
import { ConversationsController } from "./conversations.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema },{ name: Conversation.name, schema: ConversationSchema },]),
  ],
  controllers: [MessagesController, ConversationsController],
  providers: [MessagesService, ChatGateway, ConversationsService],
  exports: [MessagesService],
})
export class MessagesModule {}
