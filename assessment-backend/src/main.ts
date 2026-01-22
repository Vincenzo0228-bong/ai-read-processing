import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // or true for all origins (not recommended for production)
    credentials: true, // if you use cookies/auth
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
