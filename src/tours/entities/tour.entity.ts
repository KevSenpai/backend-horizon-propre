import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

export enum TourStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('tours')
// Contraintes d'unicité pour empêcher les conflits de planning (RM-PL-003)
@Unique(['team', 'tour_date']) 
@Unique(['vehicle', 'tour_date'])
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  system_id: string; // ex: TOUR-20241128-A

  @Column()
  name: string; // ex: "Matin - Mabanga"

  @Column({ type: 'date' })
  tour_date: string; // YYYY-MM-DD

  // --- Relations ---

  // Une tournée appartient à une Team
  @ManyToOne(() => Team, { eager: true }) // eager: true charge les infos de la team automatiquement
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ nullable: true }) // Utile pour créer via l'ID directement
  team_id: string;

  // Une tournée utilise un Véhicule
  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ nullable: true })
  vehicle_id: string;

  // --- Statut ---

  @Column({
    type: 'enum',
    enum: TourStatus,
    default: TourStatus.DRAFT,
  })
  status: TourStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

   @DeleteDateColumn() // <--- AJOUTEZ CETTE LIGNE
  deleted_at: Date;
}