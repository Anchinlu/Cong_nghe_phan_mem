// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS để frontend (chạy ở port 3000) có thể gọi được API
  app.enableCors();

  await app.listen(8080);
}
bootstrap();