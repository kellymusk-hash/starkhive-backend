import { Controller, Post, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './Guard/Jwt.guard';

@Controller('connections')
@UseGuards(JwtAuthGuard)
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('request/:requesterId/:recipientId')
  async sendConnection(
    @Param('requesterId') requesterId: string,
    @Param('recipientId') recipientId: string,
  ) {
    return this.connectionService.sendConnectionRequest(requesterId, recipientId);
  }

  @Patch('accept/:connectionId')
  async acceptConnection(@Param('connectionId') connectionId: string) {
    return this.connectionService.acceptConnectionRequest(connectionId);
  }

  @Delete('decline/:connectionId')
  async declineConnection(@Param('connectionId') connectionId: string) {
    return this.connectionService.declineConnectionRequest(connectionId);
  }
}
