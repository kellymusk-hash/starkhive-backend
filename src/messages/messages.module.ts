import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageRepository } from './message.repository';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessageRepository],
  exports: [MessagesService],
})
export class MessagesModule {}