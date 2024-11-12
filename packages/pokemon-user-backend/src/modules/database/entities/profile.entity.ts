import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProfileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    iconurl: string;
}

