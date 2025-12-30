import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum InvoiceStatus {
  PENDING = 'PENDING',   // En attente
  PAID = 'PAID',         // Payée
  PARTIAL = 'PARTIAL',   // Payée partiellement
  OVERDUE = 'OVERDUE',   // En retard
  CANCELLED = 'CANCELLED' // Annulée
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relation : Une facture appartient à un Client
  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  client_id: string;

  // Montant à payer (Decimal pour la précision monétaire)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  // Période (ex: "Décembre 2025" ou "2025-12")
  @Column()
  period: string;

  // Date limite de paiement
  @Column({ type: 'date' })
  due_date: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING
  })
  status: InvoiceStatus;

  // Relation inverse : Une facture peut avoir plusieurs paiements (acomptes)
  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}