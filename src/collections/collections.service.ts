import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection, CollectionStatus } from './entities/collection.entity';
// Imports des nouvelles entités
import { Tour, TourStatus } from '../tours/entities/tour.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';
import { Client } from '../clients/entities/client.entity';
@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection) private repo: Repository<Collection>,
    @InjectRepository(Tour) private tourRepo: Repository<Tour>, // <--- Injection
    @InjectRepository(TourClient) private tourClientRepo: Repository<TourClient>, 
     @InjectRepository(Client) private clientsRepository: Repository<Client>,// <--- Injection
  ) {}

  // ...
  async create(createCollectionDto: CreateCollectionDto) {
    // ... (vérification doublon existante) ...

    const collection = this.repo.create(createCollectionDto);
    const saved = await this.repo.save(collection);

    // --- MISE À JOUR CLIENT ---
    if (saved.status === 'COMPLETED') {
        // On met à jour la date de dernière collecte du client
        await this.clientsRepository.update(saved.client_id, {
            last_collected_at: new Date()
        });
    }

    // ... (auto-clôture tournée existante) ...
    return saved;
  }

  // Méthode privée pour vérifier si la tournée est finie
  private async checkAndCloseTour(tourId: string) {
    // A. Combien de clients à visiter au total ?
    const totalScheduled = await this.tourClientRepo.count({
      where: { tourId }
    });

    // B. Combien de collectes réalisées (succès ou échec) ?
    const totalDone = await this.repo.count({
      where: { tour_id: tourId }
    });

    // C. Si Tout est fait, on ferme !
    if (totalDone >= totalScheduled && totalScheduled > 0) {
      await this.tourRepo.update(tourId, {
        status: TourStatus.COMPLETED
      });
      console.log(`✅ Tournée ${tourId} clôturée automatiquement.`);
    }
  }

 // ...
  // Modifier la signature de findAll
  findAll(teamId?: string) {
    // Construction de la requête avec filtre conditionnel
    const whereCondition = teamId ? { tour: { team_id: teamId } } : {};

    return this.repo.find({
      where: whereCondition, // Applique le filtre si teamId est fourni
      relations: ['client', 'tour', 'tour.team'],
      order: { collected_at: 'DESC' },
      take: 100,
    });
  }
  // ...
}