import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
// Note: On retire l'import de Tour et TourRepository, on n'en a plus besoin ici !

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  // --- VERSION CORRIGÉE ET OPTIMISÉE (SOUS-REQUÊTE) ---
  async findAvailable(date: string) {
    return this.teamsRepository.createQueryBuilder('team')
      .where('team.status = :status', { status: 'ACTIVE' })
      .andWhere(qb => {
        // Sous-requête : "Sélectionne les IDs des équipes qui sont dans la table 'tours' à cette date"
        const subQuery = qb.subQuery()
          .select('tour.team_id')
          .from('tours', 'tour') // 'tours' est le nom de la table dans la BDD
          .where('tour.tour_date = :date', { date })
          .getQuery();
        
        // Clause principale : "L'ID de l'équipe ne doit PAS être dans la liste des occupés"
        return 'team.id NOT IN ' + subQuery;
      })
      .getMany();
  }
  // -------------------------------------

  create(createTeamDto: CreateTeamDto) {
    const team = this.teamsRepository.create(createTeamDto);
    return this.teamsRepository.save(team);
  }

  findAll() {
    return this.teamsRepository.find();
  }

  findOne(id: string) {
    return this.teamsRepository.findOneBy({ id });
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamsRepository.update(id, updateTeamDto);
  }

  remove(id: string) {
    return this.teamsRepository.softDelete(id);
  }
}