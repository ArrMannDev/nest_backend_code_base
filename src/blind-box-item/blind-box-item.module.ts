import { Module } from '@nestjs/common';
import { BlindBoxItemService } from './blind-box-item.service';
import { BlindBoxItemController } from './blind-box-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlindBoxItem } from './entities/blind-box-item.entity';
import { BlindBoxPackage } from '../blind-box-package/entities/blind-box-package.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([BlindBoxItem,BlindBoxPackage])
  ],
  controllers: [BlindBoxItemController],
  providers: [BlindBoxItemService],
  exports: [BlindBoxItemService]
})
export class BlindBoxItemModule {}
