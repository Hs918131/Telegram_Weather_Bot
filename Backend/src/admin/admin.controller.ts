import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService, // ✅ Inject ConfigService here
  ) {}

  
  @Get('users/:chatId')
  async getUserByChatId(@Param('chatId') chatId: string) {
    const user = await this.prismaService.subscriber.findUnique({
      where: { chatId: BigInt(chatId) },
      select: { chatId: true, name: true, location: true, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`User with chatId ${chatId} not found`);
    }

    return user;
  }
  
  @Get('/users/:chatId/location')
  async getUserLocation(@Param('chatId') chatId: string) {
    console.log(`Fetching location for chatId: ${chatId}`); // Debugging

    const user = await this.prismaService.subscriber.findUnique({
      where: { chatId: BigInt(chatId) },
      select: { location: true },
    });

    if (!user) {
      throw new NotFoundException(`User with chatId ${chatId} not found`);
    }

    return { location: user.location };
  }

  @Get('settings')
  async getSettings() {
    try {
      const settings = await this.prismaService.botSettings.findFirst();

      return {
        weatherApiKey:
          settings?.weatherApiKey ||
          this.configService.get<string>('WEATHER_API_KEY') ||
          'Not Set',
        telegramBotToken:
          settings?.telegramBotToken ||
          this.configService.get<string>('TELEGRAM_BOT_TOKEN') ||
          'Not Set',
      };
    } catch (error) {
      this.logger.error(`❌ Failed to fetch settings: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch settings');
    }
  }

  @Get('users')
  async getUsers() {
    try {
      return await this.prismaService.subscriber.findMany();
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @Post('users/:chatId/:action')
  async handleUserAction(
    @Param('chatId') chatId: string,
    @Param('action') action: string,
  ) {
    try {
      const chatIdBigInt = BigInt(chatId);

      console.log(`🔹 Performing action: ${action} on user: ${chatId}`);

      const user = await this.prismaService.subscriber.findUnique({
        where: { chatId: chatIdBigInt },
      });

      if (!user) {
        throw new NotFoundException(`User with chat ID ${chatId} not found`);
      }

      switch (action) {
        case 'block':
          return await this.prismaService.subscriber.update({
            where: { chatId: chatIdBigInt },
            data: { isActive: false },
          });

        case 'unblock':
          return await this.prismaService.subscriber.update({
            where: { chatId: chatIdBigInt },
            data: { isActive: true },
          });

        case 'delete':
          return await this.prismaService.subscriber.delete({
            where: { chatId: chatIdBigInt },
          });

        default:
          throw new NotFoundException(`Invalid action: ${action}`);
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to perform action ${action} on user ${chatId}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to perform action ${action}`,
      );
    }
  }

  @Delete('users/:chatId')
  async deleteUser(@Param('chatId') chatId: string) {
    try {
      const chatIdBigInt = BigInt(chatId);

      console.log(`🔹 Attempting to delete user: ${chatId}`);

      const user = await this.prismaService.subscriber.findUnique({
        where: { chatId: chatIdBigInt },
      });

      if (!user) {
        throw new NotFoundException(`User with chat ID ${chatId} not found`);
      }

      await this.prismaService.subscriber.delete({
        where: { chatId: chatIdBigInt },
      });

      console.log(`✅ User deleted successfully: ${chatId}`);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(`❌ Error deleting user ${chatId}:`, error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  @Put('settings')
  async updateSettings(
    @Body() settings: { weatherApiKey: string; telegramBotToken: string },
  ) {
    try {
      const existingSettings = await this.prismaService.botSettings.findFirst();

      if (existingSettings) {
        await this.prismaService.botSettings.update({
          where: { id: existingSettings.id },
          data: {
            weatherApiKey: settings.weatherApiKey,
            telegramBotToken: settings.telegramBotToken,
          },
        });
      } else {
        await this.prismaService.botSettings.create({
          data: {
            weatherApiKey: settings.weatherApiKey,
            telegramBotToken: settings.telegramBotToken,
          },
        });
      }

      console.log(`✅ Settings updated: ${JSON.stringify(settings)}`);
      return { success: true, message: 'Settings updated successfully' };
    } catch (error) {
      this.logger.error(`❌ Error updating settings: ${error.message}`);
      throw new InternalServerErrorException('Failed to update settings');
    }
  }
}
