import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TourClientsService } from './tour-clients.service';
import { CreateTourClientDto } from './dto/create-tour-client.dto';

@Controller('tour-clients')
export class TourClientsController {
  constructor(private readonly service: TourClientsService) {}

  @Post()
  create(@Body() dto: CreateTourClientDto) {
    return this.service.create(dto);
  }

  // C'est cette route qui provoque probablement le 404 si elle manque ou est mal nommée
  @Get('tour/:tourId')
  findByTour(@Param('tourId') tourId: string) {
    return this.service.findAllByTour(tourId);
  }

  @Delete(':tourId/:clientId')
  remove(@Param('tourId') tourId: string, @Param('clientId') clientId: string) {
    return this.service.removeClientFromTour(tourId, clientId);
  }
}