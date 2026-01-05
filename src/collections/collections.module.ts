import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { Collection } from './entities/collection.entity';
import { Tour } from '../tours/entities/tour.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';
// 1. AJOUT DE L'IMPORT MANQUANT
import { Client } from '../clients/entities/client.entity';

@Module({
  imports: [
    // 2. AJOUT DE Client DANS LA LISTE
    TypeOrmModule.forFeature([Collection, Tour, TourClient, Client])
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}