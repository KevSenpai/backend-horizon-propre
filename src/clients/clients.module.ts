import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { Tour } from '../tours/entities/tour.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Client, Tour])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}