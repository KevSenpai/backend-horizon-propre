import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourClientsService } from './tour-clients.service';
import { TourClientsController } from './tour-clients.controller';
import { TourClient } from './entities/tour-client.entity';
import { Tour } from '../tours/entities/tour.entity'; // <--- AJOUT

@Module({
  imports: [TypeOrmModule.forFeature([TourClient, Tour])], // <--- AJOUTER Tour ICI
  controllers: [TourClientsController],
  providers: [TourClientsService],
})
export class TourClientsModule {}