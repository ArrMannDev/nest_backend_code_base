import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlindBoxItem } from './entities/blind-box-item.entity';
import { BlindBoxPackage } from '../blind-box-package/entities/blind-box-package.entity';
import { CreateBlindBoxItemDto } from './dto/create-blind-box-item.dto';
import { UpdateBlindBoxItemDto } from './dto/update-blind-box-item.dto';

@Injectable()
export class BlindBoxItemService {
  constructor(
    @InjectRepository(BlindBoxItem)
    private readonly blindBoxItemRepository: Repository<BlindBoxItem>,

    @InjectRepository(BlindBoxPackage)
    private readonly blindBoxPackageRepository: Repository<BlindBoxPackage>,
  ) {}

  async create(dto: CreateBlindBoxItemDto) {
    const pkg = await this.blindBoxPackageRepository.findOne({
      where: { id: dto.packageId },
    });

    if (!pkg) throw new NotFoundException('Package not found');

    const item = this.blindBoxItemRepository.create({
      name: dto.name,
      image: dto.image,
      package: pkg,
    });

    await this.blindBoxItemRepository.save(item);

    return {
      message: 'Blind Box Item Created Successfully',
      data: item,
    };
  }

  findAll() {
    return this.blindBoxItemRepository.find({
      relations: ['package'],
    });
  }

  async findOne(id: number) {
    const item = await this.blindBoxItemRepository.findOne({
      where: { id },
      relations: ['package'],
    });

    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: number, dto: UpdateBlindBoxItemDto) {
    const item = await this.findOne(id);

    Object.assign(item, dto);
    await this.blindBoxItemRepository.save(item);

    return {
      message: 'Blind Box Item Updated Successfully',
      data: item,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.blindBoxItemRepository.delete(id);

    return { message: 'Blind Box Item Deleted Successfully' };
  }
}

