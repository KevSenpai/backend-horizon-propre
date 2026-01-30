import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  // 1. CRÉATION
  async create(createClientDto: CreateClientDto) {
    const client = this.clientsRepository.create(createClientDto);
    try {
      return await this.clientsRepository.save(client);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Ce numéro de téléphone est déjà utilisé.');
      }
      throw error;
    }
  }

  // 2. LECTURE
  findAll() {
    return this.clientsRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string) {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) throw new NotFoundException(`Client #${id} introuvable`);
    return client;
  }

  // 3. DISPONIBILITÉ
  async findAvailableForDate(date: string) {
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

  // 4. MISE À JOUR (VERSION BLINDÉE SQL)
  async update(id: string, updateClientDto: UpdateClientDto) {
    // On vérifie que le client existe
    await this.findOne(id);

    // On sépare la location (GPS) des autres champs
    // On utilise la destructuration pour isoler 'location'
    const { location, ...simpleFields } = updateClientDto;

    try {
      // A. Si on a des champs texte à modifier (Nom, Tel...), on utilise l'ORM standard
      // .update() est plus sûr que .save() car il ne touche pas aux colonnes non mentionnées
      if (Object.keys(simpleFields).length > 0) {
        await this.clientsRepository.update(id, simpleFields);
      }

      // B. Si on a une modification GPS, on utilise du SQL PUR pour PostGIS
      // C'est la seule façon d'éviter les erreurs de parsing GeoJSON/Binaire de TypeORM
      if (location) {
        await this.clientsRepository.query(
          `UPDATE clients 
           SET location = ST_SetSRID(ST_GeomFromGeoJSON($1), 4326),
               location_status = 'VERIFIED'
           WHERE id = $2`,
          [JSON.stringify(location), id]
        );
      }
      
      // On retourne le client mis à jour pour que le frontend ait la nouvelle version
      return this.findOne(id);

    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Ce numéro de téléphone est déjà utilisé.');
      }
      throw error;
    }
  }

  // 5. SUPPRESSION (Soft Delete)
  async remove(id: string) {
    const result = await this.clientsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client #${id} introuvable`);
    }
    return result;
  }
}