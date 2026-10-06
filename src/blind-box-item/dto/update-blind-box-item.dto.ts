import { PartialType } from '@nestjs/mapped-types';
import { CreateBlindBoxItemDto } from './create-blind-box-item.dto';

export class UpdateBlindBoxItemDto extends PartialType(CreateBlindBoxItemDto) {}
