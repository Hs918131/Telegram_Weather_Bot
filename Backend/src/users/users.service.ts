import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.subscriber.findMany();

    return users.map((user) => ({
      id: user.id,
      chatId: user.chatId ? user.chatId.toString() : 'N/A',
      name: user.name || 'N/A',
      location: user.location || 'Unknown',
      isActive: user.isActive,
      isAdmin: user.isAdmin ? 'Admin' : 'User',
      subscribedAt: user.subscribedAt ? user.subscribedAt.toISOString() : 'N/A',
    }));
  }
}
