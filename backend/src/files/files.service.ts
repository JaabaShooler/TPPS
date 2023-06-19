import { Injectable, Query } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity, FileType } from './entities/file.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { UserId } from '../decorators/user-id.decorator';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
  ) {}
  findAll(userId: number, fileType: FileType) {
    const qb = this.repository.createQueryBuilder('file');
    qb.where('file.userId = :userId', { userId });

    if (fileType === FileType.PHOTOS) {
      qb.andWhere('file.mimeType ILIKE :type', { type: '%image%' });
    }

    if (fileType === FileType.TRASH) {
      qb.withDeleted().andWhere('file.deletedAt IS NOT NULL');
    }

    return qb.getMany();
  }

  async create(file: Express.Multer.File, userId: number) {
    return await this.repository.save({
      fileName: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      user: { id: userId } as UserEntity,
      deletedAt: null,
    });
  }

  async remove(userId: number, ids: string) {
    const idsArray = ids.split(',');

    const qb = this.repository.createQueryBuilder('file');

    qb.where('id IN (:...ids) AND userId = :userId', {
      ids: idsArray,
      userId,
    });
    return qb.softDelete().execute();
  }
}
