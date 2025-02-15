import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { WeatherModule } from '../weather/weather.module'; // ✅ Import WeatherModule
import { WeatherService } from '../weather/weather.service';

@Module({
  imports: [
    WeatherModule, // ✅ Make sure WeatherModule is included
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>('TELEGRAM_BOT_TOKEN');
        if (!token) {
          throw new Error(
            'Telegram bot token is missing! Check your environment variables.',
          );
        }
        return { token };
      },
    }),
  ],
  providers: [TelegramService, TelegramUpdate, WeatherService], // ✅ Add WeatherService
  exports: [TelegramService],
})
export class TelegramModule {}
