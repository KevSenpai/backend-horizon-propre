import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection, CollectionStatus } from './entities/collection.entity';
// Imports des nouvelles entités
import { Tour, TourStatus } from '../tours/entities/tour.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection) private repo: Repository<Collection>,
    @InjectRepository(Tour) private tourRepo: Repository<Tour>, // <--- Injection
    @InjectRepository(TourClient) private tourClientRepo: Repository<TourClient>, // <--- Injection
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const { tour_id, client_id } = createCollectionDto;

    // 1. Vérification doublon (Idempotence)
    const existing = await this.repo.findOne({
      where: { tour_id, client_id }
    });
    if (existing) return existing;

    // 2. Création de la collecte
    const collection = this.repo.create(createCollectionDto);
    const savedCollection = await this.repo.save(collection);

    // --- 3. AUTO-CLÔTURE DE LA TOURNÉE ---
    await this.checkAndCloseTour(tour_id);

    return savedCollection;
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

  // ... (Garder la méthode findAll inchangée) ...
  findAll() {
    return this.repo.find({
      relations: ['client', 'tour', 'tour.team'],
      order: { collected_at: 'DESC' },
    });
  }
}