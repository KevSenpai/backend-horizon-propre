import { Injectable, ConflictException } from '@nestjs/common';
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

  update(id: string, updateClientDto: UpdateClientDto) {
    return this.clientsRepository.update(id, updateClientDto);
  }

  remove(id: string) {
    return this.clientsRepository.delete(id);
    // Note : Comme nous avons ajouté @DeleteDateColumn dans l'entité, 
    // .delete(id) effectuera automatiquement un "Soft Delete" (mettra à jour deleted_at)
    // au lieu de supprimer la ligne physiquement. C'est géré par TypeORM.
  }
}