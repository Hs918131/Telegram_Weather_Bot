import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(private prismaService: PrismaService) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new Error(
        '❌ TELEGRAM_BOT_TOKEN is not set in environment variables.',
      );
    }

    this.bot = new Telegraf(botToken);
  }

  async getUserByChatId(chatId: bigint) {
    return this.prismaService.subscriber.findUnique({
      where: { chatId },
      select: { isActive: true, location: true },
    });
  }

  async deleteUser(chatId: bigint) {
    try {
      await this.prismaService.subscriber.delete({
        where: { chatId },
      });

      console.log(
        `✅ User ${chatId} has been unsubscribed and deleted from the database.`,
      );
    } catch (error) {
      console.error(`❌ Error deleting user ${chatId}:`, error);
    }
  }

  async saveUser(userData: { chatId: bigint; name: string; location: string }) {
    try {
      const existingUser = await this.getUserByChatId(userData.chatId);

      if (existingUser) {
        return this.prismaService.subscriber.update({
          where: { chatId: userData.chatId },
          data: {
            name: userData.name,
            location: userData.location,
            isActive: true,
          },
        });
      }

      return this.prismaService.subscriber.create({
        data: {
          chatId: userData.chatId,
          name: userData.name,
          location: userData.location,
          isActive: true,
        },
      });
    } catch (error) {
      console.error('❌ Error saving user:', error);
      throw new Error('Failed to save user.');
    }
  }

  async unsubscribeUser(chatId: bigint) {
    try {
      await this.prismaService.subscriber.update({
        where: { chatId },
        data: { isActive: false },
      });

      console.log(`✅ User ${chatId} has been unsubscribed.`);
    } catch (error) {
      console.error(`❌ Error unsubscribing user ${chatId}:`, error);
    }
  }

  async updateUserLocation(chatId: bigint, location: string) {
    await this.prismaService.subscriber.update({
      where: { chatId },
      data: { location },
    });

    console.log(`✅ Updated location for ${chatId}: ${location}`);
  }

  async sendWeatherUpdate(chatId: bigint, weatherData: any) {
    const message = `
🌤 **Weather Update**:
🌡 **Temperature**: ${weatherData.temperature}°C
☁️ **Condition**: ${weatherData.condition}
💧 **Humidity**: ${weatherData.humidity}%
    `;

    try {
      await this.bot.telegram.sendMessage(chatId.toString(), message);
    } catch (error) {
      console.error(`❌ Failed to send weather update to ${chatId}:`, error);
    }
  }
}
