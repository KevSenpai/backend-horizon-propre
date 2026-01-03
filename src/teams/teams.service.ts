import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { Tour } from '../tours/entities/tour.entity';
@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private teamsRepository: Repository<Team>,
    @InjectRepository(Tour) private toursRepository: Repository<Tour>, // <--- Injection
  ) {}

   // Trouver les équipes disponibles pour une date donnée
  async findAvailable(date: string) {
    // 1. Trouver les IDs des équipes occupées ce jour-là
    const busyTours = await this.toursRepository.find({
      where: { tour_date: date },
      select: ['team_id']
    });
    const busyTeamIds = busyTours.map(t => t.team_id).filter(id => id !== null);

    // 2. Construire la requête
    const query = this.teamsRepository.createQueryBuilder('team')
      .where('team.status = :status', { status: 'ACTIVE' });

    // 3. Exclure les occupés (si il y en a)
    if (busyTeamIds.length > 0) {
      query.andWhere('team.id NOT IN (:...ids)', { ids: busyTeamIds });
    }

    return query.getMany();
  }

  create(createTeamDto: CreateTeamDto) {
    // Crée une nouvelle instance d'équipe et la sauvegarde
    const team = this.teamsRepository.create(createTeamDto);
    return this.teamsRepository.save(team);
  }

  findAll() {
    // Récupère toutes les équipes
    return this.teamsRepository.find();
  }

  findOne(id: string) {
    return this.teamsRepository.findOneBy({ id });
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamsRepository.update(id, updateTeamDto);
  }

  remove(id: string) {
    return this.teamsRepository.delete(id);
  }
}