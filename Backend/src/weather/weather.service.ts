import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WeatherService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async getWeatherData(location: string) {
    try {
      // 🔹 Fetch the latest API key from the database
      const settings = await this.prismaService.botSettings.findFirst();
      const apiKey =
        settings?.weatherApiKey ||
        this.configService.get<string>('WEATHER_API_KEY');

      // 🔹 If API key is missing, return an error
      if (!apiKey || apiKey.trim() === '') {
        throw new HttpException(
          '⚠️ API Key is missing or invalid.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const baseUrl = 'https://api.tomorrow.io/v4/weather/realtime';

      const response = await axios.get(`${baseUrl}`, {
        params: { location, apikey: apiKey },
      });

      const weather = response.data?.data?.values;
      if (!weather) {
        throw new HttpException(
          'Invalid weather data received.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Mapping weatherCode to human-readable conditions
      const weatherCodeMap = {
        1000: 'Clear',
        1100: 'Mostly Clear',
        1101: 'Partly Cloudy',
        1102: 'Mostly Cloudy',
        1001: 'Cloudy',
        2000: 'Fog',
        2100: 'Light Fog',
        4000: 'Drizzle',
        4001: 'Rain',
        4200: 'Light Rain',
        4201: 'Heavy Rain',
        5000: 'Snow',
        5001: 'Flurries',
        5100: 'Light Snow',
        5101: 'Heavy Snow',
        6000: 'Freezing Drizzle',
        6001: 'Freezing Rain',
        6200: 'Light Freezing Rain',
        6201: 'Heavy Freezing Rain',
        7000: 'Ice Pellets',
        7101: 'Heavy Ice Pellets',
        7102: 'Light Ice Pellets',
      };

      return {
        temperature: weather.temperature,
        condition: weatherCodeMap[weather.weatherCode] || 'Unknown',
        humidity: weather.humidity,
      };
    } catch (error) {
      console.error(
        '❌ Weather API Error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        '❌ Failed to fetch weather data. Check API key.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
