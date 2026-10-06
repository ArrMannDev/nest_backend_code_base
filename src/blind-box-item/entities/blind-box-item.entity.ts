// blind-box-item.entity.ts
import { BlindBoxPackage } from 'src/blind-box-package/entities/blind-box-package.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';


@Entity('blind_box_items')
export class BlindBoxItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image?: string;
  // Probability / rarity
  @Column({ type: 'float', default: 0 })
  dropRate: number; // e.g. 0.2 = 20%
  @ManyToOne(() => BlindBoxPackage, (pkg) => pkg.items, {
    onDelete: 'CASCADE',
  })
  package: BlindBoxPackage;
}
