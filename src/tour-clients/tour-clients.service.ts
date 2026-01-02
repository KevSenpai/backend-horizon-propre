import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourClientDto } from './dto/create-tour-client.dto';
import { TourClient } from './entities/tour-client.entity';
import { Tour } from '../tours/entities/tour.entity'; // <--- AJOUT IMPORT

@Injectable()
export class TourClientsService {
  constructor(
    @InjectRepository(TourClient) private repo: Repository<TourClient>,
    @InjectRepository(Tour) private toursRepository: Repository<Tour>, // <--- INJECTION DU REPO TOUR
  ) {}

  // Ajouter un client (Avec vérification de conflit de date)
  async create(dto: CreateTourClientDto) {
    // 1. Récupérer la date de la tournée cible
    const targetTour = await this.toursRepository.findOneBy({ id: dto.tourId });
    if (!targetTour) throw new NotFoundException("Tournée introuvable");

    // 2. Vérifier si ce client est DÉJÀ dans une AUTRE tournée à la MÊME date
    // On cherche dans la table de liaison, en faisant une jointure sur la table Tour
    const existingConflict = await this.repo.createQueryBuilder('tc')
      .innerJoin('tc.tour', 'tour') // On joint pour avoir la date
      .where('tc.client_id = :clientId', { clientId: dto.clientId })
      .andWhere('tour.tour_date = :date', { date: targetTour.tour_date })
      .getOne();

    if (existingConflict) {
      throw new ConflictException(
        `Ce client est déjà planifié dans une autre tournée pour la date du ${targetTour.tour_date}`
      );
    }

    // 3. Si pas de conflit, on crée
    const link = this.repo.create(dto);
    return this.repo.save(link);
  }

  // ... (Garder les méthodes findAllByTour, removeClientFromTour inchangées) ...
  
  findAllByTour(tourId: string) {
    return this.repo.find({
      where: { tourId },
      order: { position: 'ASC' },
      relations: ['client'], 
    });
  }

  async removeClientFromTour(tourId: string, clientId: string) {
    return this.repo.delete({ tourId, clientId });
  }

  findAll() { return this.repo.find(); }
  findOne(id: number) { return `Not implemented`; }
  update(id: number, updateDto: any) { return `Not implemented`; }
  remove(id: number) { return `Not implemented`; }
}