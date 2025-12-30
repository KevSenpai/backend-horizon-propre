import { IsUUID, IsNotEmpty, IsNumber, IsString, IsDateString, Min } from 'class-validator';

export class CreateInvoiceDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsDateString() // Format YYYY-MM-DD
  due_date: string;
}