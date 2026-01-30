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

  // 3. DISPONIBILITÉ (C'est la méthode qui manquait !)
  async findAvailableForDate(date: string) {
    return this.clientsRepository.createQueryBuilder('client')
      .where('client.status = :status', { status: 'ACTIVE' })
      .andWhere(qb => {
        // On exclut les clients déjà planifiés ce jour-là dans n'importe quelle tournée
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

  // 4. MISE À JOUR (Méthode manuelle robuste)
  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    
    // Fusion manuelle
    Object.assign(client, updateClientDto);

    try {
      return await this.clientsRepository.save(client);
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