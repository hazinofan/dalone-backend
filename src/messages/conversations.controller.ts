// src/messages/conversations.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // POST /conversations
  // Body: { participants: ["userAId", "userBId"] }
  @Post()
  async createConversation(@Body('participants') participants: string[]) {
    return this.conversationsService.create(participants);
  }

  // GET /conversations/user/:userId
  @Get('user/:userId')
  async getConversationsForUser(@Param('userId') userId: string) {
    return this.conversationsService.findForUser(userId);
  }

  // GET /conversations/between?user1=xxx&user2=yyy
  @Get('between')
  async findConversationBetween(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ) {
    return this.conversationsService.findOneByParticipants(user1, user2);
  }

  // GET /conversations/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.conversationsService.findById(id);
  }
}
