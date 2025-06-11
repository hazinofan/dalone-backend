import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch('mark-read')
  async markReadBetween(
    @Query('recipientId') recipientId: string,
    @Query('senderId') senderId: string
  ) {
    return this.messagesService.markAsReadBetween(recipientId, senderId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messagesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  @Get('conversation/between')
  findConversation(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ) {
    return this.messagesService.findConversation(user1, user2);
  }

  @Get('conversations/:userId')
  getConversations(@Param('userId') userId: string) {
    return this.messagesService.getConversationsForUser(userId);
  }
}
