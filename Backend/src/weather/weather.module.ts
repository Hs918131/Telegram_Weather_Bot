import { forwardRef, Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { TelegramModule } from '../telegram/telegram.module'; 

@Module({
  imports: [forwardRef(() => TelegramModule)], 
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
