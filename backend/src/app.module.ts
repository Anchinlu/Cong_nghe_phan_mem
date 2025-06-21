// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      // Thêm dấu '!' để báo cho TypeScript rằng chúng ta chắc chắn biến này tồn tại
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT!, 10),
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!, // <-- Lỗi của bạn ở đây đã được sửa
      database: process.env.DATABASE_NAME!,
      autoLoadEntities: true,
      synchronize: true, 
    }),

    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}