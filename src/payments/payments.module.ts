import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Module({
  // On enregistre les entités Payment et Invoice
  imports: [TypeOrmModule.forFeature([Payment, Invoice])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}