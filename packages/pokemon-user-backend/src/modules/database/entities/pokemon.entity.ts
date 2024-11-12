import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PokemonEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    url: string
}

