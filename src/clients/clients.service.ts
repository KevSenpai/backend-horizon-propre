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

  // --- CORRECTION UPDATE (Méthode Manuelle Infaillible) ---
  async update(id: string, updateClientDto: UpdateClientDto) {
    // 1. On récupère
    const client = await this.findOne(id);

    // 2. On met à jour manuellement les champs simples
    // Cela évite les bugs de fusion avec l'objet Location complexe
    Object.assign(client, updateClientDto);

    try {
      // 3. On sauvegarde
      return await this.clientsRepository.save(client);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Ce numéro de téléphone est déjà utilisé.');
      }
      throw error;
    }
  }

  // --- CORRECTION DELETE (Soft Delete) ---
  async remove(id: string) {
    // Au lieu de .delete() qui essaie de détruire la ligne (et échoue à cause des liens),
    // on utilise .softDelete() qui met juste à jour la date 'deleted_at'.
    const result = await this.clientsRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Client #${id} introuvable`);
    }
    return result;
  }
}