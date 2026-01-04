import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourClientDto } from './dto/create-tour-client.dto';
import { TourClient } from './entities/tour-client.entity';
import { Tour } from '../tours/entities/tour.entity';
import { Collection } from '../collections/entities/collection.entity'; // <--- INJECTION
@Injectable()
export class TourClientsService {
  constructor(
    @InjectRepository(TourClient) private repo: Repository<TourClient>,
    @InjectRepository(Tour) private toursRepository: Repository<Tour>,
    @InjectRepository(Collection) private collectionsRepository: Repository<Collection>, // <--- INJECTION
  ) {}

  async create(dto: CreateTourClientDto) {
    const targetTour = await this.toursRepository.findOneBy({ id: dto.tourId });
    if (!targetTour) throw new NotFoundException("Tournée introuvable");

    // Vérif conflit date
    const existingConflict = await this.repo.createQueryBuilder('tc')
      .innerJoin('tc.tour', 'tour')
      .where('tc.client_id = :clientId', { clientId: dto.clientId })
      .andWhere('tour.tour_date = :date', { date: targetTour.tour_date })
      .getOne();

    if (existingConflict) {
      throw new ConflictException(`Ce client est déjà planifié dans une autre tournée le ${targetTour.tour_date}`);
    }

    const link = this.repo.create(dto);
    return this.repo.save(link);
  }

  async findAllByTour(tourId: string) {
    // 1. Récupérer la liste des clients prévus
    const tourClients = await this.repo.find({
      where: { tourId },
      order: { position: 'ASC' },
      relations: ['client'], 
    });

    // 2. Récupérer les collectes DÉJÀ FAITES pour cette tournée
    const completedCollections = await this.collectionsRepository.find({
      where: { tour_id: tourId }
    });

    // 3. Créer un Set des IDs clients déjà collectés pour une recherche rapide
    const collectedClientIds = new Set(completedCollections.map(c => c.client_id));

    // 4. Fusionner les infos : on ajoute le statut 'COMPLETED' si trouvé
    return tourClients.map(tc => ({
      ...tc,
      // Si l'ID du client est dans la liste des collectés, le statut est COMPLETED
      status: collectedClientIds.has(tc.clientId) ? 'COMPLETED' : 'PENDING'
    }));
  }
  // Méthodes standards
  findAll() { return this.repo.find(); }
  findOne(id: number) { return `Not implemented`; }
  update(id: number, updateDto: any) { return `Not implemented`; }
  remove(id: number) { return `Not implemented`; }
}