import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Tour } from './entities/tour.entity';
import { Client } from '../clients/entities/client.entity';
import { TourClient } from '../tour-clients/entities/tour-client.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour) private toursRepository: Repository<Tour>,
    @InjectRepository(Client) private clientsRepository: Repository<Client>,
    @InjectRepository(TourClient) private tourClientsRepository: Repository<TourClient>,
  ) {}

  async create(createTourDto: CreateTourDto) {
    const dateStr = createTourDto.tour_date.toString().replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const systemId = `TOUR-${dateStr}-${randomSuffix}`;

    try {
      const tour = this.toursRepository.create({
        ...createTourDto,
        system_id: systemId
      });
      return await this.toursRepository.save(tour);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Cette équipe ou ce véhicule est déjà assigné pour cette date.');
      }
      throw error;
    }
  }

  findAll() {
    return this.toursRepository.find({
      order: { tour_date: 'DESC' }
    });
  }

  findOne(id: string) {
    return this.toursRepository.findOneBy({ id });
  }

  update(id: string, updateTourDto: UpdateTourDto) {
    return this.toursRepository.update(id, updateTourDto);
  }

  remove(id: string) {
    return this.toursRepository.delete(id);
  }

  // --- ALGORITHME DE PLANIFICATION AUTOMATIQUE ---
  // Cette méthode doit être DANS la classe, avant l'accolade fermante finale
  async autoPlanTour(tourId: string, depotLat: number = -1.6585, depotLng: number = 29.2205) {
    const tour = await this.findOne(tourId);
    if (!tour) throw new NotFoundException('Tournée introuvable');

    const date = new Date(tour.tour_date);
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayName = days[date.getDay()];

    // Trouver les candidats
    const candidates = await this.clientsRepository.createQueryBuilder('client')
      .where(':day = ANY(client.collection_days)', { day: dayName })
      .andWhere('client.status = :status', { status: 'ACTIVE' })
      .andWhere('client.location_status = :geoStatus', { geoStatus: 'VERIFIED' })
      .getMany();

    // Algorithme Nearest Neighbor
    let currentLat = depotLat;
    let currentLng = depotLng;
    let unvisited = [...candidates];
    const orderedClients: Client[] = [];

    while (unvisited.length > 0) {
      let nearestIndex = -1;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const c = unvisited[i];
        // Cast en any pour accéder aux propriétés GeoJSON sans erreur de typage stricte
        const loc: any = c.location; 
        // Vérification de sécurité si loc est null
        if (!loc || !loc.coordinates) continue; 

        const cLat = loc.coordinates[0]; 
        const cLng = loc.coordinates[1];

        const dist = Math.sqrt(Math.pow(cLat - currentLat, 2) + Math.pow(cLng - currentLng, 2));
        
        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = i;
        }
      }

      if (nearestIndex === -1) break; // Sécurité si aucun client valide

      const nearest = unvisited[nearestIndex];
      orderedClients.push(nearest);
      
      const nearestLoc: any = nearest.location;
      currentLat = nearestLoc.coordinates[0];
      currentLng = nearestLoc.coordinates[1];
      
      unvisited.splice(nearestIndex, 1);
    }

    // Sauvegarde
    await this.tourClientsRepository.delete({ tourId });

    const tourClientsToSave = orderedClients.map((client, index) => {
      return this.tourClientsRepository.create({
        tourId: tour.id,
        clientId: client.id,
        position: index + 1
      });
    });

    await this.tourClientsRepository.save(tourClientsToSave);

    return { message: 'Planification automatique terminée', count: orderedClients.length };
  }
}