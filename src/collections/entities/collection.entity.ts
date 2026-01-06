import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Tour } from '../../tours/entities/tour.entity';

export enum CollectionStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  MISSED = 'MISSED',
}

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tour)
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @Column()
  tour_id: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  client_id: string;

  @Column({
    type: 'enum',
    enum: CollectionStatus,
  })
  status: CollectionStatus;

  @Column({ nullable: true })
  reason_if_failed: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  collected_at: Date;

  @CreateDateColumn()
  created_at: Date;
}