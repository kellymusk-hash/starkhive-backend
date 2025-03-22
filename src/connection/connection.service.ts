import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Connection, ConnectionStatus } from './entities/connection.entity';
import { User } from '@src/user/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async sendConnectionRequest(
    requesterId: string,
    recipientId: string,
  ): Promise<Connection> {
    if (requesterId === recipientId) {
      throw new BadRequestException('You cannot connect with yourself.');
    }

    const existingConnection = await this.connectionRepository.findOne({
      where: [
        { requester: { id: requesterId }, recipient: { id: recipientId } },
        { requester: { id: recipientId }, recipient: { id: requesterId } },
      ],
    });

    if (existingConnection) {
      throw new BadRequestException('Connection request already exists.');
    }

    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
    });
    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
    });

    if (!requester || !recipient) {
      throw new NotFoundException('User not found.');
    }

    const connection = this.connectionRepository.create({
      requester,
      recipient,
      status: ConnectionStatus.PENDING,
    });

    return this.connectionRepository.save(connection);
  }

  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
    });
    if (!connection) {
      throw new NotFoundException('Connection request not found.');
    }

    connection.status = ConnectionStatus.CONNECTED;
    connection.connectedAt = new Date();

    return this.connectionRepository.save(connection);
  }

  async declineConnectionRequest(connectionId: string): Promise<void> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
    });
    if (!connection) {
      throw new NotFoundException('Connection request not found.');
    }

    await this.connectionRepository.remove(connection);
  }

  async recommendConnections(userId: string): Promise<User[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const connectedUserIds = user.sentConnections
      .filter(
        (conn: { status: any }) => conn.status === ConnectionStatus.CONNECTED,
      )
      .map((conn: { recipient: { id: any } }) => conn.recipient.id)
      .concat(
        user.receivedConnections
          .filter(
            (conn: { status: any }) =>
              conn.status === ConnectionStatus.CONNECTED,
          )
          .map((conn: { requester: { id: any } }) => conn.requester.id),
      );

    return this.userRepository.find({
      where: { id: Not(In([...connectedUserIds, userId])) },
      take: 5,
    });
  }

  async findConnectionDegree(
    userId: string,
    targetUserId: string,
  ): Promise<number> {
    const firstDegree = await this.connectionRepository.findOne({
      where: [
        {
          requester: { id: userId },
          recipient: { id: targetUserId },
          status: ConnectionStatus.CONNECTED,
        },
        {
          requester: { id: targetUserId },
          recipient: { id: userId },
          status: ConnectionStatus.CONNECTED,
        },
      ],
    });

    if (firstDegree) return 1;

    const secondDegree = await this.connectionRepository.findOne({
      where: [
        { requester: { id: userId }, status: ConnectionStatus.CONNECTED },
        { recipient: { id: targetUserId }, status: ConnectionStatus.CONNECTED },
      ],
    });

    if (secondDegree) return 2;

    return 3;
  }

  async sendConnectionNotification(recipientId: string, message: string) {
    const user = await this.userRepository.findOne({
      where: { id: recipientId },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const notification = this.notificationRepository.create({
      user,
      message,
      isRead: false,
    });

    await this.notificationRepository.save(notification);
  }

}
