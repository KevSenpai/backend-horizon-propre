import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = this.invoicesRepository.create(createInvoiceDto);
    return this.invoicesRepository.save(invoice);
  }

  findAll() {
    return this.invoicesRepository.find({
      relations: ['client'], // Important pour afficher le nom du client
      order: { created_at: 'DESC' }
    });
  }

  findOne(id: string) {
    return this.invoicesRepository.findOne({
      where: { id },
      relations: ['client', 'payments']
    });
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesRepository.update(id, updateInvoiceDto);
  }

  remove(id: string) {
    return this.invoicesRepository.delete(id);
  }
}