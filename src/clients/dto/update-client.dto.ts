import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsOptional } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  // On écrase la définition de location pour être sûr qu'elle est optionnelle et accepte tout objet
  @IsOptional()
  location?: any; 

  // On s'assure que le statut geo est aussi optionnel
  @IsOptional()
  location_status?: any;
}