import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsEmail } from 'class-validator';
import { ClientType, ServiceType, CollectionDay, GeoStatus } from '../entities/client.entity';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsOptional()
  @IsEmail()
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

  @IsEnum(ClientType)
  client_type: ClientType;

  @IsEnum(ServiceType)
  service_type: ServiceType;

  @IsArray()
  @IsEnum(CollectionDay, { each: true })
  collection_days: CollectionDay[];

  // --- C'EST ICI LE FIX ---
  // On autorise tout objet pour la location (GeoJSON) pour éviter l'erreur 400
  @IsOptional() 
  location?: any;

  @IsOptional()
  @IsEnum(GeoStatus)
  location_status?: GeoStatus;
}