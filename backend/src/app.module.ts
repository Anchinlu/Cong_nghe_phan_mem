// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT!, 10),
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!, 
      database: process.env.DATABASE_NAME!,
      autoLoadEntities: true,
      synchronize: true, 
    }),

    MoviesModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}