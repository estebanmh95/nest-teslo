import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: { socket: Socket; user: User };
}
@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('user not found');
    }
    if (!user.isActive) throw new Error('User not active');
    const clientExists = this.checkExistingUsers(user.id);
    if (clientExists) {
      delete this.connectedClients[clientExists];
    }
    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(clientId: string) {
    return this.connectedClients[clientId].user;
  }

  private checkExistingUsers(userId: string) {
    for (const client of Object.keys(this.connectedClients)) {
      if (this.connectedClients[client].user.id === userId) {
        this.connectedClients[client].socket.disconnect();
        return client;
      }
    }
  }
}
