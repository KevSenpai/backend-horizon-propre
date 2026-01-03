import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  // --- VERSION CORRIGÉE ET OPTIMISÉE ---
  async findAvailable(date: string) {
    return this.vehiclesRepository.createQueryBuilder('vehicle')
      .where('vehicle.status = :status', { status: 'OPERATIONAL' })
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('tour.vehicle_id')
          .from('tours', 'tour')
          .where('tour.tour_date = :date', { date })
          .getQuery();
        return 'vehicle.id NOT IN ' + subQuery;
      })
      .getMany();
  }
  // -------------------------------------

  create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    return this.vehiclesRepository.save(vehicle);
  }

  findAll() {
    return this.vehiclesRepository.find();
  }

  findOne(id: string) {
    return this.vehiclesRepository.findOneBy({ id });
  }

  update(id: string, updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesRepository.update(id, updateVehicleDto);
  }

  remove(id: string) {
    return this.vehiclesRepository.softDelete(id);
  }
}