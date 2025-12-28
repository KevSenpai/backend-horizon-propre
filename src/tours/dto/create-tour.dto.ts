import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { TourStatus } from '../entities/tour.entity';

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  // On accepte une string car le frontend envoie "YYYY-MM-DD"
  tour_date: string; 

  @IsUUID() // Vérifie que c'est bien un ID valide
  @IsNotEmpty()
  team_id: string;

  @IsUUID()
  @IsNotEmpty()
  vehicle_id: string;

  @IsOptional() // <--- AJOUT CRUCIAL : Le statut n'est pas obligatoire à la création
  @IsEnum(TourStatus)
  status?: TourStatus;
}