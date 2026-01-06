import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { Tour } from './entities/tour.entity';
import { Client } from '../clients/entities/client.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';
import { PdfService } from './pdf.service';
// 👇 C'EST L'IMPORT QUI MANQUAIT :
import { Collection } from '../collections/entities/collection.entity';

@Module({
  // On enregistre toutes les entités nécessaires
  imports: [TypeOrmModule.forFeature([Tour, Client, TourClient, Collection])],
  controllers: [ToursController],
  providers: [ToursService, PdfService],
})
export class ToursModule {}