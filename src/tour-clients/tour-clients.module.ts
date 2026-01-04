import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourClientsService } from './tour-clients.service';
import { TourClientsController } from './tour-clients.controller';
import { TourClient } from './entities/tour-client.entity';
import { Tour } from '../tours/entities/tour.entity';
import { Collection } from '../collections/entities/collection.entity'; // <--- AJOUT IMPORT

@Module({
  // AJOUTER Collection DANS LA LISTE
  imports: [TypeOrmModule.forFeature([TourClient, Tour, Collection])], 
  controllers: [TourClientsController],
  providers: [TourClientsService],
})
export class TourClientsModule {}