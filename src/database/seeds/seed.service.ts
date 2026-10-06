import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { BlindBoxPackage } from '../../blind-box-package/entities/blind-box-package.entity';
import { BlindBoxItem } from '../../blind-box-item/entities/blind-box-item.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BlindBoxPackage)
    private readonly packageRepository: Repository<BlindBoxPackage>,
    @InjectRepository(BlindBoxItem)
    private readonly itemRepository: Repository<BlindBoxItem>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedPackagesAndItems();
  }

  private async seedUsers() {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const password = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        name: 'Admin User',
        email: adminEmail,
        password,
        role: 'admin',
        balance: 10000,
      });
      await this.userRepository.save(admin);
      this.logger.log('Admin user created');
    }

    const userEmail = 'user@example.com';
    const existingUser = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!existingUser) {
      const password = await bcrypt.hash('user123', 10);
      const user = this.userRepository.create({
        name: 'Normal User',
        email: userEmail,
        password,
        role: 'user',
        balance: 1000,
      });
      await this.userRepository.save(user);
      this.logger.log('Normal user created');
    }
  }

  private async seedPackagesAndItems() {
    const packageName = 'Cyberpunk Series';
    const existingPackage = await this.packageRepository.findOne({ where: { name: packageName } });

    if (!existingPackage) {
      const pkg = this.packageRepository.create({
        name: packageName,
        description: 'Futuristic cyberpunk themed blind box',
        price: 100,
        stock: 50,
        productType: 'Digital',
        itemType: 'Collectible',
        isActive: true,
      });
      await this.packageRepository.save(pkg);
      this.logger.log(`Package "${packageName}" created`);

      // Seed Items
      const items = [
        { name: 'Neon Samurai', dropRate: 0.05, image: 'neon_samurai.png' }, // Legendary
        { name: 'Cyber Ninja', dropRate: 0.15, image: 'cyber_ninja.png' },   // Epic
        { name: 'Hacker Drone', dropRate: 0.30, image: 'hacker_drone.png' }, // Rare
        { name: 'Street Rat', dropRate: 0.50, image: 'street_rat.png' },     // Common
      ];

      for (const itemData of items) {
        const item = this.itemRepository.create({
          ...itemData,
          package: pkg,
        });
        await this.itemRepository.save(item);
      }
      this.logger.log(`Items for "${packageName}" created`);
    }
  }
}
