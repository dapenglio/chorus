import { Controller, Get } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../database/entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('pokemon')
export class PokemonController {
  constructor(
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>,
  ) {}

  @Get()
  async getPokemons() {
    return await this.pokemonRepository.find({ take: 150 });
  }
}

