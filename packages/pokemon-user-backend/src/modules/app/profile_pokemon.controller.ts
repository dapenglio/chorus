import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePokemon} from '../database/entities/profile_pokemon';
import { ProfileEntity } from '../database/entities/profile.entity';
import { PokemonEntity } from '../database/entities/pokemon.entity';

@Controller('profilePokemon')
export class ProfilePokemonController {
  constructor(
    @InjectRepository(ProfilePokemon)
    private readonly profileToPokemonRepository: Repository<ProfilePokemon>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>,
  ) {}

  // Get all Pokémon associated with a given profile
  @Get()
  async getProfilePokemons(@Query('profileId') profileId: number) {
    return await this.profileToPokemonRepository.find({
      where: { profile: { id: profileId } },
      relations: ['pokemon'],
    });
  }

  // Add or remove Pokémon from a profile
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
      const existingEntry = await this.profileToPokemonRepository.findOne({
        where: { profile: { id: profileId }, pokemon: { id: pokemonId } },
      });
      if (!existingEntry) {
        const profileToPokemon = this.profileToPokemonRepository.create({ profile, pokemon });
        await this.profileToPokemonRepository.save(profileToPokemon);
      }
    } else if (action === 'remove') {
      await this.profileToPokemonRepository.delete({ profile: { id: profileId }, pokemon: { id: pokemonId } });
    }
  }
}

