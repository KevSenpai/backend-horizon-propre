import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourClientsService } from './tour-clients.service';
import { TourClientsController } from './tour-clients.controller';
import { TourClient } from './entities/tour-client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourClient])],
  controllers: [TourClientsController],
  providers: [TourClientsService],
})
export class TourClientsModule {}