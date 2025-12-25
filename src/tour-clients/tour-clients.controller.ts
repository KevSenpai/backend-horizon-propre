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

  // Cette méthode doit bien être DANS la classe (avant la dernière accolade)
  @Get('tour/:tourId')
  findByTour(@Param('tourId') tourId: string) {
    return this.service.findAllByTour(tourId);
  }

  // La méthode de suppression pour le Drag & Drop
  @Delete(':tourId/:clientId')
  remove(@Param('tourId') tourId: string, @Param('clientId') clientId: string) {
    return this.service.removeClientFromTour(tourId, clientId);
  }
} 
// La classe se ferme ICI. Rien ne doit être écrit après.