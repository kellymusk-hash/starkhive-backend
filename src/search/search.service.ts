import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../../../src/messages/message.repository';

@Injectable()
export class SearchService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async searchMessages(query: string): Promise<any[]> {
    const messages = await this.messageRepository.findAll();
    return messages.filter(message => 
      message.content.includes(query) || 
      message.sender.includes(query) || 
      message.receiver.includes(query)
    );
  }
}