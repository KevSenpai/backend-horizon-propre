import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TeamStatus } from '../entities/team.entity';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional() // <--- AJOUT IMPORTANT : Ce champ n'est pas obligatoire
  @IsString()
  members_info?: string;

  @IsEnum(TeamStatus)
  @IsOptional() // Le statut est optionnel car il a une valeur par défaut
  status?: TeamStatus;
}