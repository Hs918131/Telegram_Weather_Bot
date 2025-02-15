import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to the database.');

    // Fetch API keys from the database (if available)
    const settings = await this.botSettings.findFirst();
    if (settings) {
      process.env.WEATHER_API_KEY = settings.weatherApiKey;
      process.env.TELEGRAM_BOT_TOKEN = settings.telegramBotToken;
      console.log('🔄 Loaded API keys from database.');
    } else {
      console.log('⚠️ No API keys found in database. Using .env values.');
    }
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`⚠️ Application is shutting down due to signal: ${signal}`);
    await this.$disconnect();
  }
}
