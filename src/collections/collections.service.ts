import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private repo: Repository<Collection>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['client', 'tour', 'tour.team'], // On veut savoir QUI et QUAND
      order: { collected_at: 'DESC' }, // Du plus récent au plus vieux
      take: 100, // Limite aux 100 derniers pour commencer (pagination plus tard)
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }
  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
