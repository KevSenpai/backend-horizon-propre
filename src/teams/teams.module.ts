import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { Tour } from '../tours/entities/tour.entity'; // <--- IMPORT

@Module({
  imports: [TypeOrmModule.forFeature([Team, Tour])], // <--- AJOUT DE TOUR
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}