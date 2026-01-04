import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private repo: Repository<Collection>,
  ) {}

  // --- C'EST CETTE MÉTHODE QUI MANQUAIT ---
  findAll() {
    return this.repo.find({
      relations: ['client', 'tour', 'tour.team'], // On récupère les infos liées
      order: { collected_at: 'DESC' }, // Du plus récent au plus ancien
    });
  }
  // ----------------------------------------

  // Méthode pour créer une collecte (utilisée par le Mobile)
  create(createCollectionDto: CreateCollectionDto) {
    const collection = this.repo.create(createCollectionDto);
    return this.repo.save(collection);
  }
}