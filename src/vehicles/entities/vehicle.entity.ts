import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum VehicleStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; // ex: "Camion Benne 01"

  @Column({ length: 20, unique: true })
  license_plate: string; // ex: "KV 1234 BB"

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.OPERATIONAL,
  })
  status: VehicleStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @DeleteDateColumn() // <--- AJOUTEZ CETTE LIGNE
  deleted_at: Date;
}
