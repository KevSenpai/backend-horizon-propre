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

  // Récupérer les clients pour le PDF
  async getTourClients(tourId: string) {
    return this.tourClientsRepository.find({
      where: { tourId },
      order: { position: 'ASC' },
      relations: ['client'],
    });
  }

  // --- ALGORITHME DE PLANIFICATION AUTOMATIQUE ---
  // Cette méthode doit être DANS la classe, avant l'accolade fermante finale
 // --- NOUVEL ALGORITHME : CAPACITÉ & PRIORITÉ ---
  async autoPlanTour(tourId: string) {
    // 1. Initialiser la Transaction (Tout ou Rien)
    const queryRunner = this.toursRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // --- ÉTAPE 1 : VERROUILLER LE CONTEXTE ---
      // On récupère la tournée avec son Équipe et son Véhicule
      const tour = await queryRunner.manager.findOne(Tour, {
        where: { id: tourId },
        relations: ['team', 'vehicle']
      });

      if (!tour) throw new NotFoundException('Tournée introuvable');
      if (tour.status !== 'DRAFT') throw new ConflictException('La tournée doit être en brouillon');

      // --- ÉTAPE 2 : CALCULER LA CAPACITÉ RÉELLE ---
      // La chaîne est aussi forte que son maillon le plus faible
      const teamCap = tour.team.capacity || 20; // Valeur par défaut si non définie
      const vehicleCap = tour.vehicle.capacity || 20;
      const realCapacity = Math.min(teamCap, vehicleCap);

      console.log(`Planification Tournée ${tour.name} - Capacité cible : ${realCapacity}`);

      // --- ÉTAPE 3 : FILTRER LES CLIENTS ÉLIGIBLES ---
      // Jour de la semaine (ex: 'MONDAY')
      const date = new Date(tour.tour_date);
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const dayName = days[date.getDay()];

      const clientsQuery = this.clientsRepository.createQueryBuilder('client')
        // Règle : Client Actif
        .where('client.status = :status', { status: 'ACTIVE' })
        // Règle : Doit être collecté ce jour-là (Selon contrat)
        .andWhere(':day = ANY(client.collection_days)', { day: dayName })
        // Règle : PAS déjà planifié ce jour-là (dans une autre tournée)
        .andWhere(qb => {
            const subQuery = qb.subQuery()
              .select('tc.client_id')
              .from('tour_clients', 'tc')
              .innerJoin('tours', 't', 't.id = tc.tour_id')
              .where('t.tour_date = :date', { date: tour.tour_date })
              .andWhere('t.id != :currentTourId', { currentTourId: tourId }) // On exclut la tournée actuelle
              .getQuery();
            return 'client.id NOT IN ' + subQuery;
        });

      // --- ÉTAPE 4 : PRIORISER (TRI) ---
      // Ordre : 
      // 1. Ceux qui n'ont jamais été collectés (NULL) ou les plus anciens (ASC) -> Les "En retard"
      // 2. Ensuite, on pourrait trier par Type de client si besoin, mais la date prime.
      clientsQuery.orderBy('client.last_collected_at', 'ASC', 'NULLS FIRST');

      // --- ÉTAPE 5 : REMPLIR (LIMITE) ---
      const selectedClients = await clientsQuery.take(realCapacity).getMany();

      if (selectedClients.length === 0) {
        throw new ConflictException("Aucun client éligible trouvé pour cette date/zone.");
      }

      // --- ÉTAPE 6 : AFFECTATION ATOMIQUE ---
      
      // A. Vider la tournée actuelle (au cas où on relance l'algo)
      await queryRunner.manager.delete(TourClient, { tourId: tour.id });

      // B. Créer les liens
      const tourClients = selectedClients.map((client, index) => {
        return queryRunner.manager.create(TourClient, {
          tourId: tour.id,
          clientId: client.id,
          position: index + 1 // Ordre simple 1, 2, 3...
        });
      });

      // C. Sauvegarder en masse
      await queryRunner.manager.save(TourClient, tourClients);

      // Tout est bon, on valide la transaction
      await queryRunner.commitTransaction();

      return { 
        message: 'Planification terminée', 
        capacity: realCapacity,
        added: selectedClients.length,
        clients: selectedClients.map(c => c.name)
      };

    } catch (err) {
      // En cas de pépin, on annule tout (Rollback)
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // On libère la connexion
      await queryRunner.release();
    }
  }
}