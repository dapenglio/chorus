import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../database/entities/pokemon.entity';

@Controller('pokemon')
export class PokemonController {
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

  // Get a single Pokémon by ID
  @Get(':id')
  async getPokemonById(@Param('id') id: number) {
    return await this.pokemonRepository.findOne({ where: { id } });
  }
}

