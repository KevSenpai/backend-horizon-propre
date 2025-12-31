import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { Client, ServiceType } from '../clients/entities/client.entity';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Client) private clientsRepository: Repository<Client>,
  ) {}

  // --- NOUVELLE FONCTION : GÉNÉRATION AUTOMATIQUE ---
  async generateMonthlyInvoices() {
    const currentPeriod = new Date().toISOString().slice(0, 7); // "2025-12"
    
    // 1. Récupérer tous les clients actifs
    const clients = await this.clientsRepository.find({ where: { status: 'ACTIVE' } });
    
    let createdCount = 0;

    for (const client of clients) {
      // 2. Vérifier si facture déjà existante pour ce mois
      const existing = await this.invoicesRepository.findOne({
        where: { client_id: client.id, period: currentPeriod }
      });

      if (existing) continue; // On ne facture pas deux fois

      // 3. Déterminer le prix selon l'abonnement
      let amount = 0;
      switch (client.service_type) {
        case ServiceType.WEEKLY_STANDARD: amount = 10; break;
        case ServiceType.BI_WEEKLY: amount = 20; break;
        case ServiceType.ON_DEMAND: amount = 5; break;
        default: amount = 10;
      }

      // 4. Créer la facture
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15); // Échéance à J+15

      const invoice = this.invoicesRepository.create({
        client_id: client.id,
        amount: amount,
        period: currentPeriod,
        due_date: dueDate.toISOString().split('T')[0],
        status: InvoiceStatus.PENDING
      });

      await this.invoicesRepository.save(invoice);
      createdCount++;
    }

    this.logger.log(`Génération terminée : ${createdCount} factures créées pour ${currentPeriod}`);
    return { message: 'Génération terminée', created: createdCount, period: currentPeriod };
  }
  // --------------------------------------------------

  // ... (Gardez les méthodes create, findAll, findOne, update, remove inchangées)
  create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = this.invoicesRepository.create(createInvoiceDto);
    return this.invoicesRepository.save(invoice);
  }

  findAll() {
    return this.invoicesRepository.find({
      relations: ['client'],
      order: { created_at: 'DESC' }
    });
  }
  
  findOne(id: string) {
    return this.invoicesRepository.findOne({ where: { id }, relations: ['client'] });
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesRepository.update(id, updateInvoiceDto);
  }

  remove(id: string) {
    return this.invoicesRepository.delete(id);
  }
}