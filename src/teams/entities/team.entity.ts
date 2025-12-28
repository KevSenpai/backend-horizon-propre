import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum TeamStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('teams') // <--- C'est vital !
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  members_info: string;

  @Column({
    type: 'enum',
    enum: TeamStatus,
    default: TeamStatus.ACTIVE,
  })
  status: TeamStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

   @DeleteDateColumn() // <--- AJOUTEZ CETTE LIGNE
  deleted_at: Date;
}