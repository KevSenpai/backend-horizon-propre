import { Controller, Get, Post, Body } from '@nestjs/common'; // <--- Ajoutez Post et Body
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  // --- C'EST CE BLOC QUI MANQUAIT ---
  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }
  // ----------------------------------

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }
}