// import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';

// @Controller('api')
// export class AppController {
//   private users = [
//     { chatId: '1292090230', location: 'London', status: 'Blocked', role: 'Admin' },
//   ];
//   private settings = {
//     weatherApiKey: '',
//     telegramBotToken: '',
//   };

//   // Get all users
//   @Get('users')
//   getUsers() {
//     return this.users;
//   }

//   // Unblock a user
//   @Post('users/unblock')
//   unblockUser(@Body() body) {
//     const user = this.users.find(u => u.chatId === body.chatId);
//     if (user) {
//       user.status = 'Active';
//       return { message: 'User unblocked successfully' };
//     }
//     return { message: 'User not found' };
//   }

//   // Delete a user
//   @Delete('users/:chatId')
//   deleteUser(@Param('chatId') chatId: string) {
//     this.users = this.users.filter(u => u.chatId !== chatId);
//     return { message: 'User deleted successfully' };
//   }

//   // Get bot settings
//   @Get('settings')
//   getSettings() {
//     return this.settings;
//   }

//   // Update bot settings
//   @Post('settings')
//   updateSettings(@Body() body) {
//     this.settings = body;
//     return { message: 'Settings updated successfully' };
//   }
// }

import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api')
export class AppController {
  constructor(private prisma: PrismaService) {}

  // Get all users
  @Get('users')
  async getUsers() {
    return await this.prisma.subscriber.findMany(); // Fetch all users from the database
  }

  // Unblock a user
  @Post('users/unblock')
  async unblockUser(@Body() body: { chatId: string }) {
    const user = await this.prisma.subscriber.findUnique({
      where: { chatId: body.chatId },
    });

    if (!user) return { message: 'User not found' };

    await this.prisma.subscriber.update({
      where: { chatId: body.chatId },
      data: { isActive: true },
    });

    return { message: 'User unblocked successfully' };
  }

  // Delete a user
  @Delete('users/:chatId')
  async deleteUser(@Param('chatId') chatId: string) {
    const user = await this.prisma.subscriber.findUnique({ where: { chatId } });

    if (!user) return { message: 'User not found' };

    await this.prisma.subscriber.delete({ where: { chatId } });

    return { message: 'User deleted successfully' };
  }

  // Get bot settings
  @Get('settings')
  async getSettings() {
    return await this.prisma.settings.findFirst(); // Assuming you have a `settings` table
  }

  // Update bot settings
  @Post('settings')
  async updateSettings(
    @Body() body: { weatherApiKey: string; telegramBotToken: string },
  ) {
    return await this.prisma.settings.update({
      where: { id: 1 }, // Assuming only one settings row exists
      data: body,
    });
  }
}
