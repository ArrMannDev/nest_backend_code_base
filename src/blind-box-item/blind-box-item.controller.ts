import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BlindBoxItemService } from './blind-box-item.service';
import { CreateBlindBoxItemDto } from './dto/create-blind-box-item.dto';
import { UpdateBlindBoxItemDto } from './dto/update-blind-box-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('items')
@Controller('blind-box-items')
export class BlindBoxItemController {
  constructor(
    private readonly blindBoxItemService: BlindBoxItemService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blind box item' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        packageId: { type: 'number' },
        dropRate: { type: 'number' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images',
      filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
      },
    }),
  }))
  create(@Body() dto: CreateBlindBoxItemDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      dto.image = file.filename;
    }
    return this.blindBoxItemService.create(dto);
  }

  @Get()    
  findAll() {
    return this.blindBoxItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blindBoxItemService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images',
      filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
      },
    }),
  }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlindBoxItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.image = file.filename;
    }
    return this.blindBoxItemService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blindBoxItemService.remove(+id);
  }
}
