import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsOptional } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  // On force la permissivité sur la location pour la mise à jour aussi
  @IsOptional()
  location?: any;
}