import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import { Column, PrimaryGeneratedColumn, Unique } from "typeorm";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    @Unique(['email'])
    email: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    photo?: string;

    @IsString()
    @Column({default: 'user'})
    role: string;
}
