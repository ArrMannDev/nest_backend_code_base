import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BlindBoxItemModule } from './blind-box-item/blind-box-item.module';
import { BlindBoxPackageModule } from './blind-box-package/blind-box-package.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';

// Load .env variables
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port:  5432, // always parseInt for numbers
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,  // auto-import all entities
      synchronize: true,
    }),
    UsersModule,
    BlindBoxItemModule,
    BlindBoxPackageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
