// blind-box-package.entity.ts
import { BlindBoxItem } from 'src/blind-box-item/entities/blind-box-item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';


@Entity('blind_box_packages')
export class BlindBoxPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({default: 'common'})
  productType: string;

  @Column()
  itemType: string;

  @OneToMany(() => BlindBoxItem, (item) => item.package)
  items: BlindBoxItem[];
}
