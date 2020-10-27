import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'gratitudes' })
export class GratitudeEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamp without time zone', })
  createdAt: Date;

  @Column({ type: 'character varying', nullable: true, length: 16 })
  from: string | null;

  @Column({ length: 16 })
  to: string;

  @Column()
  reason: string;
}
