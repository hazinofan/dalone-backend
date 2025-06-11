// src/messages/schemas/conversations.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: [String], required: true, index: true })
  participants: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
