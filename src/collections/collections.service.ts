import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
// ... imports

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private repo: Repository<Collection>,
  ) {}

  // Vérifiez que cette méthode existe bien :
  create(createCollectionDto: CreateCollectionDto) {
    const collection = this.repo.create(createCollectionDto);
    return this.repo.save(collection);
  }

  // ... findAll ...
}