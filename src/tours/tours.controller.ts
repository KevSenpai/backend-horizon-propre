import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Res, Header, StreamableFile } from '@nestjs/common'; // <--- Nouveaux imports
import { PdfService } from './pdf.service'; // <--- Import service
import type { Response } from 'express';
@Controller('tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  // --- LE NOUVEAU ENDPOINT MAGIQUE ---
  @Post(':id/auto-plan')
  autoPlan(@Param('id') id: string) {
    return this.toursService.autoPlanTour(id);
  }
  // -----------------------------------

  @Get()
  findAll() {
    return this.toursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toursService.remove(id);
  }

   // --- NOUVEAU : TÉLÉCHARGER PDF ---
  @Get(':id/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=feuille_de_route.pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    // 1. Récupérer les données
    const tour = await this.toursService.findOne(id);
    
    // CORRECTION : On vérifie si la tournée existe
    if (!tour) {
        throw new NotFoundException('Tournée introuvable');
    }

    // Maintenant TypeScript sait que 'tour' n'est pas null
    const tourClients = await this.toursService.getTourClients(id);

    // 2. Générer le PDF
    const buffer = this.pdfService.generateTourRoadmap(tour, tourClients);
    
    // 3. Envoyer le flux
    buffer.pipe(res);
  }
}
