import { Controller, Get, Post, Param, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../database/entities/pokemon.entity';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TO_FILL_DB } from './app.module';

@Controller('pokemon')
export class PokemonController implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>,
  ) {}

  @Get()
  async getPokemons() {
    return await this.pokemonRepository.find({
      take: 150,
      order: { id: 'ASC' },
    });
  }

  @Get(':id')
  async getPokemonById(@Param('id') id: number) {
    return await this.pokemonRepository.findOne({ where: { id } });
  }

  @Post('initPokemons')
  async initPokemons(): Promise<void> {
    const sqlPath = join(__dirname, '..', '..', '..', 'sql_insert_pokemon');
    const sql = readFileSync(sqlPath, 'utf8');
    await this.pokemonRepository.query(sql);
  }

  async onApplicationBootstrap() {
    if (TO_FILL_DB) {
      await this.initPokemons();
    }
  }
}

