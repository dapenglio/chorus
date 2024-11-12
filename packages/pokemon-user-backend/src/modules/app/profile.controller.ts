import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoreThanOrEqual } from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../database/entities/profile.entity';

@Controller('profiles')
export class ProfileController {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  // (1) Load up to n profiles, starting from min profile id m
  @Get()
  async getProfiles(@Query('m') minId: number, @Query('n') limit: number) {
    return await this.profileRepository.find({
      where: minId ? { id: MoreThanOrEqual(minId) } : {},
      take: limit ? limit : 10,
      order: { id: 'ASC' },
    });
  }

  // (2) Load one profile by profile id
  @Get(':id')
  async getProfileById(@Param('id') id: number) {
    return await this.profileRepository.findOne({ where: { id } });
  }
}

