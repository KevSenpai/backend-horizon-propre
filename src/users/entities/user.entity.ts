import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// 1. DÉFINITION DE L'ENUM (C'est ce qui manquait)
export enum UserRole {
  ADMIN = 'ADMIN',       // Accès total
  PLANNER = 'PLANNER',   // Gestion des tournées
  FIELD_TEAM = 'FIELD',  // Accès mobile uniquement
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string; // On stocke le mot de passe crypté ici

  // 2. UTILISATION DE L'ENUM DANS LA COLONNE
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLANNER,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}