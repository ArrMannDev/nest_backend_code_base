import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBlindBoxItemDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  image?: string;

  @IsNotEmpty()
  packageId: number;

  @IsNumber()
  dropRate: number;
}
