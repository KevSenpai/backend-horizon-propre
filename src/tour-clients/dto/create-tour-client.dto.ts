import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateTourClientDto {
  @IsUUID()
  @IsNotEmpty()
  tourId: string;

  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  position: number;
}