import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { Tour } from '../tours/entities/tour.entity';
@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Tour) private toursRepository: Repository<Tour>,
  ) {}

  // ... constructor avec injections Vehicle et Tour ...

  async findAvailable(date: string) {
    const busyTours = await this.toursRepository.find({
      where: { tour_date: date },
      select: ['vehicle_id']
    });
    const busyVehicleIds = busyTours.map(t => t.vehicle_id).filter(id => id !== null);

    const query = this.vehiclesRepository.createQueryBuilder('vehicle')
      .where('vehicle.status = :status', { status: 'OPERATIONAL' });

    if (busyVehicleIds.length > 0) {
      query.andWhere('vehicle.id NOT IN (:...ids)', { ids: busyVehicleIds });
    }

    return query.getMany();
  }

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
    return this.vehiclesRepository.delete(id);
  }
}