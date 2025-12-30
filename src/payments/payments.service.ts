import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
// 👇 C'EST CETTE LIGNE QUI MANQUAIT :
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  findAll() {
    return this.paymentsRepository.find({
      relations: ['invoice'], // On récupère la facture liée
      order: { created_at: 'DESC' }
    });
  }

  findOne(id: string) {
    return this.paymentsRepository.findOne({
      where: { id },
      relations: ['invoice']
    });
  }

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsRepository.update(id, updatePaymentDto);
  }

  remove(id: string) {
    return this.paymentsRepository.delete(id);
  }
}