import { IsString, IsEmail, IsNotEmpty, IsEnum, IsArray, IsOptional } from 'class-validator';
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

  @IsOptional()
  location?: any; // On peut affiner avec un DTO spécifique pour GeoJSON plus tard

  @IsOptional()
  @IsEnum(GeoStatus)
  location_status?: GeoStatus;
}
