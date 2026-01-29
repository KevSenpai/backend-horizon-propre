import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Tour } from '../tours/entities/tour.entity';
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Tour) private toursRepository: Repository<Tour>,
  ) {}

  // ... injections de Client, Tour, TourClient ...

  async findAvailableForDate(date: string) {
    // Sous-requête pour trouver les clients dans une tournée à cette date
    // Note: C'est une requête un peu complexe, on va utiliser le QueryBuilder
    return this.clientsRepository.createQueryBuilder('client')
      .where('client.status = :status', { status: 'ACTIVE' })
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('tc.client_id')
          .from('tour_clients', 'tc')
          .innerJoin('tours', 't', 't.id = tc.tour_id')
          .where('t.tour_date = :date', { date })
          .getQuery();
        return 'client.id NOT IN ' + subQuery;
      })
      .getMany();
  }

  async create(createClientDto: CreateClientDto) {
    // 1. Préparer l'entité
    const client = this.clientsRepository.create(createClientDto);

    try {
      // 2. Tenter de sauvegarder dans la base de données
      return await this.clientsRepository.save(client);
    } catch (error: any) {
      // 3. Intercepter l'erreur de contrainte d'unicité (PostgreSQL code 23505)
      if (error.code === '23505') {
        throw new ConflictException('Ce numéro de téléphone est déjà utilisé par un autre client.');
      }
      // Si c'est une autre erreur, on la laisse remonter (Crash 500 normal)
      throw error;
    }
  }

  findAll() {
    return this.clientsRepository.find({
      order: { created_at: 'DESC' } // On trie par les plus récents
    });
  }

  findOne(id: string) {
    return this.clientsRepository.findOneBy({ id });
  }


  remove(id: string) {
    return this.clientsRepository.delete(id);
    // Note : Comme nous avons ajouté @DeleteDateColumn dans l'entité, 
    // .delete(id) effectuera automatiquement un "Soft Delete" (mettra à jour deleted_at)
    // au lieu de supprimer la ligne physiquement. C'est géré par TypeORM.
  }
 async update(id: string, updateClientDto: UpdateClientDto) {
    // 1. "Preload" fusionne les nouvelles données avec l'existant
    const client = await this.clientsRepository.preload({
      id: id,
      ...updateClientDto,
    });

    // 2. Si le client n'existe pas
    if (!client) {
      throw new NotFoundException(`Client #${id} introuvable`);
    }

    try {
      // 3. On sauvegarde (C'est mieux que update() pour PostGIS)
      return await this.clientsRepository.save(client);
    } catch (error: any) {
      // 4. Gestion des doublons (Si on modifie le numéro vers un numéro déjà pris)
      if (error.code === '23505') {
        throw new ConflictException('Ce numéro de téléphone est déjà utilisé par un autre client.');
      }
      throw error; // Laisse passer les autres erreurs (500)
    }
  }
}