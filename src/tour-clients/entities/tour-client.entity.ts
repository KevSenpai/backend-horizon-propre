import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { Tour } from '../../tours/entities/tour.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('tour_clients')
// Un client ne peut être qu'une seule fois dans une même tournée
@Unique(['tour', 'client']) 
// La position doit être unique au sein d'une même tournée (pas deux clients en position 1)
@Unique(['tour', 'position']) 
export class TourClient {
  
  // Clé Primaire Composée : ID Tour
  @PrimaryColumn({ name: 'tour_id' })
  tourId: string;

  // Clé Primaire Composée : ID Client
  @PrimaryColumn({ name: 'client_id' })
  clientId: string;

  @Column({ type: 'int' })
  position: number; // 1, 2, 3...

  // --- Relations ---

  @ManyToOne(() => Tour, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}