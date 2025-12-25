import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDto } from './create-tour.dto';
import { TourStatus } from '../entities/tour.entity';

export class UpdateTourDto extends PartialType(CreateTourDto) {
  status?: TourStatus;
}