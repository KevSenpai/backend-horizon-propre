import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourClientDto } from './dto/create-tour-client.dto';
import { TourClient } from './entities/tour-client.entity';
import { Tour } from '../tours/entities/tour.entity';
import { Collection } from '../collections/entities/collection.entity';

@Injectable()
export class TourClientsService {
  constructor(
    @InjectRepository(TourClient) private repo: Repository<TourClient>,
    @InjectRepository(Tour) private toursRepository: Repository<Tour>,
    @InjectRepository(Collection) private collectionsRepository: Repository<Collection>,
  ) {}

  // 1. AJOUTER UN CLIENT (Avec vérification de conflit de date)
  async create(dto: CreateTourClientDto) {
    const targetTour = await this.toursRepository.findOneBy({ id: dto.tourId });
    if (!targetTour) throw new NotFoundException("Tournée introuvable");

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

  // 2. RÉCUPÉRER LA LISTE (Avec statut COMPLETED/PENDING)
  async findAllByTour(tourId: string) {
    // a. Liste prévue
    const tourClients = await this.repo.find({
      where: { tourId },
      order: { position: 'ASC' },
      relations: ['client'], 
    });

    // b. Liste réalisée
    const completedCollections = await this.collectionsRepository.find({
      where: { tour_id: tourId }
    });

    // c. Fusion
    const collectedClientIds = new Set(completedCollections.map(c => c.client_id));

    return tourClients.map(tc => ({
      ...tc,
      status: collectedClientIds.has(tc.clientId) ? 'COMPLETED' : 'PENDING'
    }));
  }

  // 3. RETIRER UN CLIENT (C'est la méthode qui manquait !)
  async removeClientFromTour(tourId: string, clientId: string) {
    return this.repo.delete({ tourId, clientId });
  }

  // Méthodes standards (placeholders)
  findAll() { return this.repo.find(); }
  findOne(id: number) { return `Not implemented`; }
  update(id: number, updateDto: any) { return `Not implemented`; }
  remove(id: number) { return `Not implemented`; }
}