import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { PokemonEntity } from './entities/pokemon.entity';
import { ProfilePokemon } from './entities/profile_pokemon';

@Injectable()
export class DbConfigService {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'pokemon',
      entities: [ProfileEntity, PokemonEntity, ProfilePokemon],
      synchronize: true,
    };
  }
}
