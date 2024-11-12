import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../database/entities/profile.entity';
import { PokemonEntity } from '../database/entities/pokemon.entity';
import { ProfilePokemon } from '../database/entities/profile_pokemon';
import { ProfileController } from './profile.controller';
import { PokemonController } from './pokemon.controller';
import { ProfilePokemonController } from './profile_pokemon.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEntity, PokemonEntity, ProfilePokemon])
  ],
  controllers: [ProfileController, PokemonController, ProfilePokemonController],
})
export class AppModule {}

