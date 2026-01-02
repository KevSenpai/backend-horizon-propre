import { IsUUID, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { CollectionStatus } from '../entities/collection.entity';

export class CreateCollectionDto {
  @IsUUID()
  @IsNotEmpty()
  tour_id: string;

  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsEnum(CollectionStatus)
  @IsNotEmpty()
  status: CollectionStatus;

  @IsOptional()
  @IsString()
  reason_if_failed?: string;
}