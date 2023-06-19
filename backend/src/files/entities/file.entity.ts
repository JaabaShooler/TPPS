import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum FileType {
  ALL = 'all',
  PHOTOS = 'photos',
  TRASH = 'trash',
}

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  size: number;

  @Column()
  mimeType: string;

  @ManyToOne(() => UserEntity, (user) => user.files)
  user: UserEntity;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
