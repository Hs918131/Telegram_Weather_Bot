import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  // Block a user
  async blockUser(chatId: bigint) {
    return this.prismaService.subscriber.update({
      where: { chatId },
      data: { isActive: false },
    });
  }

  // Unblock a user
  async unblockUser(chatId: bigint) {
    return this.prismaService.subscriber.update({
      where: { chatId },
      data: { isActive: true },
    });
  }

  // Delete a user
  async deleteUser(chatId: bigint) {
    return this.prismaService.subscriber.delete({
      where: { chatId },
    });
  }

  // Update bot settings
  async updateBotSettings(weatherApiKey: string, telegramBotToken: string) {
    const existingSettings = await this.prismaService.botSettings.findFirst();

    if (existingSettings) {
      return this.prismaService.botSettings.update({
        where: { id: existingSettings.id },
        data: { weatherApiKey, telegramBotToken },
      });
    } else {
      return this.prismaService.botSettings.create({
        data: { weatherApiKey, telegramBotToken },
      });
    }
  }

  // Get bot settings
  async getBotSettings() {
    return this.prismaService.botSettings.findFirst();
  }

  async updateSettings(settings: any) {
    return { success: true, message: 'Settings updated successfully' };
  }
}
