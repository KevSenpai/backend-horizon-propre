import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { Tour } from './entities/tour.entity';
import { Client } from '../clients/entities/client.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';
// 1. IMPORT DU SERVICE PDF
import { PdfService } from './pdf.service'; 

@Module({
  imports: [TypeOrmModule.forFeature([Tour, Client, TourClient])],
  controllers: [ToursController],
  // 2. AJOUT DANS LES PROVIDERS (C'est ce qui manquait !)
  providers: [ToursService, PdfService], 
})
export class ToursModule {}