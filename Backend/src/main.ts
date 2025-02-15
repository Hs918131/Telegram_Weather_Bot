import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

