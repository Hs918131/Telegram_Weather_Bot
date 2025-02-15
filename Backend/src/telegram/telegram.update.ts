import { Update, Start, Command, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import { WeatherService } from '../weather/weather.service';

@Update()
export class TelegramUpdate {
  constructor(
    private telegramService: TelegramService,
    private weatherService: WeatherService,
  ) {}

  async isUserBlocked(chatId: bigint): Promise<boolean> {
    const user = await this.telegramService.getUserByChatId(chatId);

    if (!user) {
      console.log(`🆕 User ${chatId} is new and NOT blocked.`);
      return false; // ✅ Treat new users as NOT blocked
    }

    console.log(`🔍 User ${chatId} status: isActive=${user.isActive}`);
    return !user.isActive; // ✅ Only return true if explicitly blocked
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    if (!ctx.chat || !ctx.from) {
      await ctx.reply('Error: Unable to get user details.');
      return;
    }

    const chatId = BigInt(ctx.from.id);
    const firstName = ctx.from.first_name || 'User';

    // ✅ New users should not be blocked
    const existingUser = await this.telegramService.getUserByChatId(chatId);
    if (existingUser && (await this.isUserBlocked(chatId))) {
      await ctx.reply('❌ You are blocked from using this bot.');
      return;
    }

    await this.telegramService.saveUser({
      chatId,
      name: firstName,
      location: 'Not Provided',
    });

    await ctx.reply(
      `✅ Welcome ${firstName}! You have been registered successfully.`,
    );
  }

  @Command('subscribe')
  async subscribe(@Ctx() ctx: Context) {
    if (!ctx.chat || !ctx.from) {
      await ctx.reply('Error: Unable to get user details.');
      return;
    }

    const chatId = BigInt(ctx.from.id);
    if (await this.isUserBlocked(chatId)) {
      await ctx.reply('❌ You are blocked from using this bot.');
      return;
    }

    const message = ctx.message as any;
    const location = message.text.split(' ').slice(1).join(' ');

    if (!location) {
      await ctx.reply(
        '⚠️ Please provide a location. Example: /subscribe New York',
      );
      return;
    }

    await this.telegramService.updateUserLocation(chatId, location);
    await ctx.reply(
      `✅ You are now subscribed for weather updates in **${location}**!`,
    );
  }

  @Command('unsubscribe')
  async unsubscribe(@Ctx() ctx: Context) {
    if (!ctx.chat || !ctx.from) {
      await ctx.reply('Error: Unable to get user details.');
      return;
    }

    const chatId = BigInt(ctx.from.id);

    // Check if user exists before deleting
    const user = await this.telegramService.getUserByChatId(chatId);
    if (!user) {
      await ctx.reply('⚠️ You are not subscribed.');
      return;
    }

    // ✅ Delete user from database
    await this.telegramService.deleteUser(chatId);
    await ctx.reply(
      '✅ You have been unsubscribed. Your data has been removed. You can rejoin anytime by using /start.',
    );
  }

  @Command('weather')
  async getInstantWeather(@Ctx() ctx: Context) {
    if (!ctx.chat || !ctx.from) {
      await ctx.reply('Error: Unable to get user details.');
      return;
    }

    const chatId = BigInt(ctx.from.id);
    if (await this.isUserBlocked(chatId)) {
      await ctx.reply('❌ You are blocked from using this bot.');
      return;
    }

    const message = ctx.message as any;
    const location = message.text.split(' ').slice(1).join(' ');

    if (!location) {
      await ctx.reply(
        '⚠️ Please provide a city name. Example: /weather London',
      );
      return;
    }

    await this.telegramService.updateUserLocation(chatId, location);

    try {
      const weatherData = await this.weatherService.getWeatherData(location);
      const responseMessage = `
🌍 **Location**: ${location}
🌡 **Temperature**: ${weatherData.temperature}°C
☁️ **Condition**: ${weatherData.condition}
💧 **Humidity**: ${weatherData.humidity}%
      `;
      await ctx.reply(responseMessage);
    } catch (error) {
      await ctx.reply('Error fetching weather data. Please try again later.');
    }
  }
}
