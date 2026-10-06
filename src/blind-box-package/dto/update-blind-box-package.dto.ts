import { PartialType } from '@nestjs/mapped-types';
import { CreateBlindBoxPackageDto } from './create-blind-box-package.dto';

export class UpdateBlindBoxPackageDto extends PartialType(CreateBlindBoxPackageDto) {}
