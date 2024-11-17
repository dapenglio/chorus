import { Controller, Get, Param, Query, Post, Body, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoreThanOrEqual } from 'typeorm';
import { ProfileEntity } from '../database/entities/profile.entity';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TO_FILL_DB } from './app.module';

@Controller('profiles')
export class ProfileController implements OnApplicationBootstrap {
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

  // (3) Create a new profile
  @Post()
  async createProfile(@Body() profileData: { name: string; iconurl?: string }) {
    const newProfile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(newProfile);
  }

  @Post('initProfiles')
  async initProfiles(): Promise<void> {
    const sqlPath = join(__dirname, '..', '..', '..', 'sql_insert_profile');
    const sql = readFileSync(sqlPath, 'utf8');
    await this.profileRepository.query(sql);
  }

  async onApplicationBootstrap() {
    if (TO_FILL_DB) {
      await this.initProfiles();
    }
  }
}

