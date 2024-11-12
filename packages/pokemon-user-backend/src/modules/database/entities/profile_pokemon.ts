import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { PokemonEntity } from "./pokemon.entity";

@Entity()
export class ProfilePokemon {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProfileEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "profileId" })
    profile: ProfileEntity;

    @ManyToOne(() => PokemonEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "pokemonId" })
    pokemon: PokemonEntity;
}

