import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsEmail } from 'class-validator';
import { ClientType, ServiceType, CollectionDay, GeoStatus } from '../entities/client.entity';
import { Transform } from 'class-transformer';
export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value === '' ? null : value)
  email?: string;

  @IsString()
  @IsNotEmpty()
  street_address: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional() // <--- On rend optionnel au cas où
  @IsEnum(ClientType)
  client_type: ClientType;

  @IsOptional() // <--- On rend optionnel au cas où
  @IsEnum(ServiceType)
  service_type: ServiceType;

  @IsOptional() // <--- On rend optionnel car parfois les tableaux passent mal
  @IsArray()
  collection_days: CollectionDay[];

  // --- LE CHAMP CRITIQUE ---
  @IsOptional() // On accepte tout (ou rien) pour la location
  location?: any; 

  @IsOptional()
  location_status?: any;
}