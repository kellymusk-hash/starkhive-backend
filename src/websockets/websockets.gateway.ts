import { WebSocketGateway, WebSocketServer, SubscribeMessage, WebSocket } from '@nestjs/websockets';
import { Message } from '../../../src/messages/message.entity';
import { WebsocketsService } from './websockets.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketsService: WebsocketsService) {}

  @SubscribeMessage('sendMessage')
  handleMessage(client: WebSocket, payload: Message): void {
    this.websocketsService.sendMessage(payload);
    this.server.emit('messageReceived', payload);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: WebSocket, room: string): void {
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: WebSocket, room: string): void {
    client.leave(room);
  }
}