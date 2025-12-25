import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team])], // <--- C'est CECI qui injecte l'entité dans le service
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}