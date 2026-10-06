import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")

export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column({ nullable: true })
    photo?:string;

    @Column()
    role:string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;
}
