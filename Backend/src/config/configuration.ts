export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY,
    baseUrl: 'https://api.tomorrow.io/v4',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
  },
});
