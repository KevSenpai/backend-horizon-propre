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
 // NOUVELLE MÉTHODE : Statistiques par mois
  async getMonthlyStats() {
    // On utilise le QueryBuilder pour faire une agrégation SQL performante
    const stats = await this.paymentsRepository.createQueryBuilder('payment')
      .select("TO_CHAR(payment.payment_date, 'YYYY-MM')", 'month') // Grouper par mois (ex: 2025-12)
      .addSelect("SUM(payment.amount)", 'total') // Somme des montants
      .groupBy('month')
      .orderBy('month', 'DESC') // Du plus récent au plus ancien
      .getRawMany();

    // On calcule aussi le total global
    const totalAllTime = await this.paymentsRepository.sum('amount');

    return {
      monthly: stats.map(s => ({
        month: s.month,
        total: parseFloat(s.total) // PostgreSQL renvoie parfois des strings pour les sommes
      })),
      totalAllTime: totalAllTime || 0
    };
  }
}