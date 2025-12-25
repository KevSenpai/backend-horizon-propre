import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { Tour } from './entities/tour.entity';
// IMPORTS AJOUTÉS
import { Client } from '../clients/entities/client.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';

@Module({
  // ON AJOUTE Client ET TourClient DANS LA LISTE
  imports: [TypeOrmModule.forFeature([Tour, Client, TourClient])],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}