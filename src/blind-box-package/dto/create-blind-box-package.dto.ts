import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBlindBoxPackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNumber()
  stock: number;

  @IsNumber()
  price: number;

  @IsString()
  productType: string;

  @IsString()
  itemType: string;
}
