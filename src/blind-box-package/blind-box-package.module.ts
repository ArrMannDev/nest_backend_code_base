import { Module } from '@nestjs/common';
import { BlindBoxPackageService } from './blind-box-package.service';
import { BlindBoxPackageController } from './blind-box-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlindBoxItem } from '../blind-box-item/entities/blind-box-item.entity';
import { UsersModule } from '../users/users.module';
import { BlindBoxPackage } from './entities/blind-box-package.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([BlindBoxPackage, BlindBoxItem]),
    UsersModule
  ],
  controllers: [BlindBoxPackageController],
  providers: [BlindBoxPackageService],
  exports:[BlindBoxPackageService]
})
export class BlindBoxPackageModule {}
