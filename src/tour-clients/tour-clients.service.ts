import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourClientDto } from './dto/create-tour-client.dto';
import { TourClient } from './entities/tour-client.entity';
import { Tour } from '../tours/entities/tour.entity';

@Injectable()
export class TourClientsService {
  constructor(
    @InjectRepository(TourClient) private repo: Repository<TourClient>,
    @InjectRepository(Tour) private toursRepository: Repository<Tour>,
  ) {}

  async create(dto: CreateTourClientDto) {
    const targetTour = await this.toursRepository.findOneBy({ id: dto.tourId });
    if (!targetTour) throw new NotFoundException("Tournée introuvable");

    // Vérif conflit date
    const existingConflict = await this.repo.createQueryBuilder('tc')
      .innerJoin('tc.tour', 'tour')
      .where('tc.client_id = :clientId', { clientId: dto.clientId })
      .andWhere('tour.tour_date = :date', { date: targetTour.tour_date })
      .getOne();

    if (existingConflict) {
      throw new ConflictException(`Ce client est déjà planifié dans une autre tournée le ${targetTour.tour_date}`);
    }

    const link = this.repo.create(dto);
    return this.repo.save(link);
  }

  findAllByTour(tourId: string) {
    return this.repo.find({
      where: { tourId },
      order: { position: 'ASC' },
      relations: ['client'], 
    });
  }

  async removeClientFromTour(tourId: string, clientId: string) {
    return this.repo.delete({ tourId, clientId });
  }

  // Méthodes standards
  findAll() { return this.repo.find(); }
  findOne(id: number) { return `Not implemented`; }
  update(id: number, updateDto: any) { return `Not implemented`; }
  remove(id: number) { return `Not implemented`; }
}