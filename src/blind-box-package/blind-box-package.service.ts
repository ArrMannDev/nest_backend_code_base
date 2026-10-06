import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BlindBoxPackage } from './entities/blind-box-package.entity';
import { CreateBlindBoxPackageDto } from './dto/create-blind-box-package.dto';
import { UpdateBlindBoxPackageDto } from './dto/update-blind-box-package.dto';
import { BlindBoxItem } from '../blind-box-item/entities/blind-box-item.entity';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class BlindBoxPackageService {
  constructor(
    @InjectRepository(BlindBoxPackage)
    private readonly blindBoxPackageRepository: Repository<BlindBoxPackage>,
    @InjectRepository(BlindBoxItem)
    private readonly blindBoxItemRepository: Repository<BlindBoxItem>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateBlindBoxPackageDto) {
    const blindBoxPackage =this.blindBoxPackageRepository.create(dto);
    await this.blindBoxPackageRepository.save(blindBoxPackage);
    return {
      message: 'Blind Box Package Created Successfully',
      data: blindBoxPackage,
    };
  }

  findAll() {
    return this.blindBoxPackageRepository.find();
  }

  async findOne(id: number) {
    const pkg = await this.blindBoxPackageRepository.findOne({
      where: { id },
    });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async update(id: number, dto: UpdateBlindBoxPackageDto) {
    const pkg = await this.findOne(id);
    Object.assign(pkg, dto);
    await this.blindBoxPackageRepository.save(pkg);
    return {
      message: 'Blind Box Package Updated Successfully',
      data: pkg,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.blindBoxPackageRepository.delete(id);
    return { message: 'Blind Box Package Deleted Successfully' };
  }

  async buy(userId: number, packageId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Get Package
      const pkg = await queryRunner.manager.findOne(BlindBoxPackage, {
        where: { id: packageId },
        relations: ['items'],
      });
      if (!pkg) throw new NotFoundException('Package not found');
      if (pkg.stock <= 0) throw new BadRequestException('Out of stock');
      if (!pkg.isActive) throw new BadRequestException('Package is not active');

      // 2. Get User
      const user = await queryRunner.manager.findOne(UserEntity, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // 3. Check Balance
      if (Number(user.balance) < Number(pkg.price)) {
        throw new BadRequestException('Insufficient balance');
      }

      // 4. Deduct Balance
      user.balance = Number(user.balance) - Number(pkg.price);
      await queryRunner.manager.save(user);

      // 5. Decrement Stock
      pkg.stock -= 1;
      await queryRunner.manager.save(pkg);

      // 6. Pick Item (Weighted Random)
      const selectedItem = this.pickRandomItem(pkg.items);
      
      await queryRunner.commitTransaction();

      return {
        message: 'Purchase Successful',
        item: selectedItem,
        remainingBalance: user.balance,
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private pickRandomItem(items: BlindBoxItem[]): BlindBoxItem | null {
    if (!items || items.length === 0) return null;

    const totalWeight = items.reduce((sum, item) => sum + item.dropRate, 0);
    // If no weights defined, pick purely random
    if (totalWeight <= 0) {
      return items[Math.floor(Math.random() * items.length)];
    }

    let random = Math.random() * totalWeight;
    for (const item of items) {
      if (random < item.dropRate) {
        return item;
      }
      random -= item.dropRate;
    }
    return items[items.length - 1]; // Fallback
  }
}
