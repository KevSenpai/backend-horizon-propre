import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { InvoiceStatus } from '../entities/invoice.entity';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  // On ajoute explicitement le droit de modifier le statut
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}