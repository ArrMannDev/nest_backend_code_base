import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { BlindBoxPackageService } from './blind-box-package.service';
import { CreateBlindBoxPackageDto } from './dto/create-blind-box-package.dto';
import { UpdateBlindBoxPackageDto } from './dto/update-blind-box-package.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('packages')
@Controller('blind-box-packages')
export class BlindBoxPackageController {
  constructor(
    private readonly blindBoxPackageService: BlindBoxPackageService,
  ) {}

  @Post(':id/buy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buy a blind box package' })
  buy(@Param('id') id: string, @Request() req) {
    return this.blindBoxPackageService.buy(req.user.userId, +id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new blind box package' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        productType: { type: 'string' },
        itemType: { type: 'string' },
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
  create(@Body() dto: CreateBlindBoxPackageDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      dto.image = file.filename;
    }
    return this.blindBoxPackageService.create(dto);
  }

  @Get()
  findAll() {
    return this.blindBoxPackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blindBoxPackageService.findOne(+id);
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
    @Body() dto: UpdateBlindBoxPackageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.image = file.filename;
    }
    return this.blindBoxPackageService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blindBoxPackageService.remove(+id);
  }
}
