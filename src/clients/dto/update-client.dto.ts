import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsOptional, IsObject, Allow } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  // @Allow() permet de dire au validateur : "Laisse passer ce champ, quoi qu'il contienne"
  @IsOptional()
  @Allow()
  location?: any;

  @IsOptional()
  @Allow()
  location_status?: any;
}