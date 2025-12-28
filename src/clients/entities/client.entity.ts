import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import type { Point } from 'geojson'; // On utilisera ce type pour le format GeoJSON

export enum ClientType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL_SMALL = 'COMMERCIAL_SMALL',
  COMMERCIAL_LARGE = 'COMMERCIAL_LARGE',
  INSTITUTIONAL = 'INSTITUTIONAL',
}

export enum ServiceType {
  WEEKLY_STANDARD = 'WEEKLY_STANDARD',
  BI_WEEKLY = 'BI_WEEKLY',
  ON_DEMAND = 'ON_DEMAND',
}

export enum CollectionDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum GeoStatus {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Index() // Index pour la recherche par nom
  name: string;

  @Column({ length: 20, unique: true })
  phone_number: string;

  @Column({ length: 255, nullable: true })
  email: string;

  // --- Adresses ---
  @Column()
  street_address: string;

  @Column()
  district: string; // Quartier

  @Column()
  city: string; // Commune

  // --- Géolocalisation PostGIS ---
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326, // Standard GPS (WGS 84)
    nullable: true,
  })
  @Index({ spatial: true }) // Index spatial pour les recherches de proximité !
  location: Point;

  @Column({
    type: 'enum',
    enum: GeoStatus,
    default: GeoStatus.UNVERIFIED,
  })
  location_status: GeoStatus;

  // --- Infos Service ---
  @Column({ type: 'enum', enum: ClientType })
  client_type: ClientType;

  @Column({ type: 'enum', enum: ServiceType })
  service_type: ServiceType;

  @Column('text', { array: true }) // Tableau de chaînes pour Postgres
  collection_days: CollectionDay[];

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

   @DeleteDateColumn() // <--- AJOUTEZ CETTE LIGNE
  deleted_at: Date;
}