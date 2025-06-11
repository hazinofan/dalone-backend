// src/messages/conversations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './schemas/conversations.schema';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectModel(Conversation.name)
        private readonly conversationModel: Model<Conversation>,
    ) { }

    async create(participants: string[]): Promise<Conversation> {
        if (participants.length !== 2) {
            throw new Error('Exactly two participant IDs are required');
        }

        const pair = participants;

        const existing = await this.conversationModel.findOne({
            participants: { $all: pair },
        }).exec();

        if (existing) {
            return existing;
        }

        // Otherwise create a new conversation
        const convo = new this.conversationModel({
            participants: pair,
        });
        return convo.save();
    }


    async findForUser(userId: string): Promise<Conversation[]> {
        // OLD: participants: new Types.ObjectId(userId)
        // NEW: match raw string
        return this.conversationModel.find({
            participants: userId,
        }).exec();
    }

    async findOneByParticipants(a: string, b: string): Promise<Conversation | null> {
        return this.conversationModel
            .findOne({
                participants: { $all: [a, b] },
            })
            .exec();
    }

    async findById(conversationId: string): Promise<Conversation> {
        const conv = await this.conversationModel.findById(conversationId).exec();
        if (!conv) throw new NotFoundException('Conversation not found');
        return conv;
    }
}
