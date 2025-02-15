import { Injectable } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { WeatherService } from './weather.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WeatherScheduler {
  constructor(
    private telegramService: TelegramService,
    private weatherService: WeatherService,
    private prismaService: PrismaService
  ) {}

  async sendDailyWeatherUpdates() {
    try {
      const users = await this.prismaService.subscriber.findMany({
        where: { isActive: true }, // ✅ Only active users get updates
        select: { chatId: true, location: true },
      });

      for (const user of users) {
        if (!user.location) continue; // Skip if location is missing

        const weatherData = await this.weatherService.getWeatherData(user.location);
        await this.telegramService.sendWeatherUpdate(BigInt(user.chatId), weatherData);
      }
    } catch (error) {
      console.error('❌ Error sending daily weather updates:', error);
    }
  }
}
