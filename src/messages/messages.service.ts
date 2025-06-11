import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) { }

  async create(dto: CreateMessageDto): Promise<Message> {
    return this.messageModel.create(dto);
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<Message> {
    const msg = await this.messageModel.findById(id);
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  async update(id: string, dto: UpdateMessageDto): Promise<Message> {
    const msg = await this.messageModel.findByIdAndUpdate(id, dto, { new: true });
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  async remove(id: string): Promise<void> {
    const result = await this.messageModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Message not found');
  }

  async findConversation(user1: string, user2: string): Promise<Message[]> {
    return this.messageModel.find({
      $or: [
        { senderId: user1, recipientId: user2 },
        { senderId: user2, recipientId: user1 },
      ],
    }).sort({ createdAt: 1 }).exec();
  }

  async getConversationsForUser(userId: string): Promise<
    {
      otherUserId: string;
      lastMessage: string;
      lastTimestamp: Date;
      unreadCount: number;
    }[]
  > {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [{ senderId: userId }, { recipientId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$recipientId',
              '$senderId',
            ],
          },
          mostRecent: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipientId', userId] },
                    { $eq: ['$read', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          otherUserId: '$_id',
          _id: 0,
          lastMessage: '$mostRecent.content',
          lastTimestamp: '$mostRecent.createdAt',
          unreadCount: 1,
        },
      },
      {
        $sort: { lastTimestamp: -1 },
      },
    ];

    const results = await this.messageModel.aggregate(pipeline).exec();
    return results as any;
  }

  async markAsReadBetween(
    recipientId: string,
    senderId: string
  ): Promise<{ modifiedCount: number }> {
    const result = await this.messageModel.updateMany(
      {
        senderId: senderId,
        recipientId: recipientId,
        read: false,
      },
      { $set: { read: true } }
    );
    return { modifiedCount: result.modifiedCount };
  }

}
