import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true }) // adds createdAt & updatedAt
export class Message {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  recipientId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  read: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
