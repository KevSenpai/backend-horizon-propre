import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourClientDto } from './dto/create-tour-client.dto';
import { TourClient } from './entities/tour-client.entity';

@Injectable()
export class TourClientsService {
  constructor(
    @InjectRepository(TourClient)
    private repo: Repository<TourClient>,
  ) {}

  // Ajouter un client
  create(dto: CreateTourClientDto) {
    const link = this.repo.create(dto);
    return this.repo.save(link);
  }

  // Récupérer la liste des clients d'une tournée
  findAllByTour(tourId: string) {
    return this.repo.find({
      where: { tourId },
      order: { position: 'ASC' },
      relations: ['client'], 
    });
  }

  // --- C'EST CETTE MÉTHODE QUI MANQUAIT ---
  async removeClientFromTour(tourId: string, clientId: string) {
    return this.repo.delete({ tourId, clientId });
  }
  // ----------------------------------------

  // Méthodes par défaut (non utilisées pour l'instant)
  findAll() { return this.repo.find(); }
  findOne(id: number) { return `Not implemented`; }
  update(id: number, updateDto: any) { return `Not implemented`; }
  remove(id: number) { return `Not implemented`; }
}