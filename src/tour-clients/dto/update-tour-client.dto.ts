import { PartialType } from '@nestjs/mapped-types';
import { CreateTourClientDto } from './create-tour-client.dto';

export class UpdateTourClientDto extends PartialType(CreateTourClientDto) {}