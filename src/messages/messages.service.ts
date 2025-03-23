import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const message = new Message();
    message.senderId = senderId;
    message.receiverId = receiverId;
    message.content = content;
    message.status = 'sent';
    message.timestamp = new Date();

    return this.messageRepository.save(message);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageRepository.findByConversationId(conversationId);
  }

  async updateMessageStatus(messageId: string, status: string): Promise<Message> {
    const message = await this.messageRepository.findById(messageId);
    if (message) {
      message.status = status;
      return this.messageRepository.save(message);
    }
    throw new Error('Message not found');
  }

  async searchMessages(query: string): Promise<Message[]> {
    return this.messageRepository.search(query);
  }
}