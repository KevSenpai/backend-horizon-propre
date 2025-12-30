import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { Client } from '../clients/entities/client.entity';

@Module({
  // On enregistre les entités Invoice et Client pour pouvoir les utiliser dans ce module
  imports: [TypeOrmModule.forFeature([Invoice, Client])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}