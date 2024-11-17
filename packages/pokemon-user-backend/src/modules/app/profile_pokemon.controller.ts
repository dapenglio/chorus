import { Controller, Get, Post, Query, Body, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilePokemon} from '../database/entities/profile_pokemon';
import { ProfileEntity } from '../database/entities/profile.entity';
import { PokemonEntity } from '../database/entities/pokemon.entity';
import { TO_FILL_DB } from './app.module';

@Controller('profilePokemon')
export class ProfilePokemonController implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(ProfilePokemon)
    private readonly profilePokemonRepository: Repository<ProfilePokemon>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>,
  ) {}

  @Get()
  async getProfilePokemons(@Query('profileId') profileId: number) {
    return await this.profilePokemonRepository.find({
      where: { profile: { id: profileId } },
      relations: ['pokemon'],
    });
  }

  @Post()
  async updateProfilePokemon(@Body() body: { profileId: number; pokemonId: number; action: 'add' | 'remove' }) {
    const { profileId, pokemonId, action } = body;

    const profile = await this.profileRepository.findOne({ where: { id: profileId } });
    const pokemon = await this.pokemonRepository.findOne({ where: { id: pokemonId } });

    if (!profile || !pokemon) {
      throw new Error('Invalid profile or pokemon ID');
    }

    if (action === 'add') {
      // Check if already exists
      const existingEntry = await this.profilePokemonRepository.findOne({
        where: { profile: { id: profileId }, pokemon: { id: pokemonId } },
      });
      if (!existingEntry) {
        const profileToPokemon = this.profilePokemonRepository.create({ profile, pokemon });
        await this.profilePokemonRepository.save(profileToPokemon);
      }
    } else if (action === 'remove') {
      await this.profilePokemonRepository.delete({ profile: { id: profileId }, pokemon: { id: pokemonId } });
    }
  }

  @Post('clearProfilePokemon')
  async clearProfilePokemon(): Promise<void> {
    await this.profilePokemonRepository.clear();
  }

  async onApplicationBootstrap() {
    if (TO_FILL_DB) {
      await this.clearProfilePokemon();
    }
  }
}

