import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { UserEntity } from '../../users/entities/user.entity';
import { BlindBoxPackage } from '../../blind-box-package/entities/blind-box-package.entity';
import { BlindBoxItem } from '../../blind-box-item/entities/blind-box-item.entity';
import { AppModule } from '../../app.module';

@Module({
  imports: [
    AppModule, // Import AppModule to get DB config
    TypeOrmModule.forFeature([UserEntity, BlindBoxPackage, BlindBoxItem]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
