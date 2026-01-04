import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { Collection } from './entities/collection.entity';
// AJOUTS IMPORTS
import { Tour } from '../tours/entities/tour.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';

@Module({
  // AJOUTER Tour ET TourClient DANS LA LISTE
  imports: [TypeOrmModule.forFeature([Collection, Tour, TourClient])], 
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}