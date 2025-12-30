import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  AIRTEL_MONEY = 'AIRTEL_MONEY',
  ORANGE_MONEY = 'ORANGE_MONEY',
  MPESA = 'MPESA',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relation : Un paiement lie une facture
  @ManyToOne(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column()
  invoice_id: string;

  // Montant payé
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH
  })
  method: PaymentMethod;

  // Référence de transaction (ex: ID MPESA)
  @Column({ nullable: true })
  reference: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  payment_date: string;

  // Qui a encaissé ? (Optionnel pour le MVP, on pourrait lier au User)
  @Column({ nullable: true })
  collected_by: string;

  @CreateDateColumn()
  created_at: Date;
}