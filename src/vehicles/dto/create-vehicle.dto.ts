import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { VehicleStatus } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  license_plate: string;

  @IsEnum(VehicleStatus)
  @IsOptional() // <--- AJOUT IMPORTANT : Le statut est optionnel (défaut: OPERATIONAL)
  status?: VehicleStatus;
}
