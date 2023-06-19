import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { responseCreator } from '../helpers/responseCreator';
import { JwtGuard } from '../auth/auth.jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { FileType } from './entities/file.entity';

@Controller('files')
@ApiTags('files')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll(@UserId() userId: number, @Query('type') fileType: FileType) {
    const files = await this.filesService.findAll(userId, fileType);
    return responseCreator(files);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: fileStorage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @UserId() userId: number,
  ) {
    return responseCreator(await this.filesService.create(file, userId));
  }

  @Delete()
  remove(@UserId() userId: number, @Query('id') ids: string) {
    return this.filesService.remove(userId, ids);
  }
}
