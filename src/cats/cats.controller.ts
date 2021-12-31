import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  Session,
  StreamableFile,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { Response } from 'express';
import { SessionData } from 'express-session';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Public } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ErrorsInterceptor } from 'src/common/interceptors/errors.interceptor';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { CatsService } from './cats.service';
import { CreateCatDTO } from './dto/create-cat.dto';
import { UpdateCatDTO } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { createCatSchema } from './schemas/create-cat.schema';

@Controller('cats')
export class CatsController {
  constructor(
    @InjectQueue('say-hello')
    private sayHelloQueue: Queue,
    private catsService: CatsService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  @UsePipes(new JoiValidationPipe(createCatSchema))
  async create(@Body() createCatDTO: CreateCatDTO): Promise<Cat> {
    return this.catsService.create(createCatDTO);
  }

  @Get()
  @Public()
  async findAll(@Session() session: SessionData): Promise<Cat[]> {
    session.visits = (session.visits || 0) + 1;

    console.log(`Visits ${session.visits}`);

    return this.catsService.findAll();
  }

  @Get('file')
  getFile(@Res({ passthrough: true }) response: Response): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));

    response.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    });

    return new StreamableFile(file);
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(ErrorsInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cat> {
    const cat = await this.catsService.findOne(id);

    await this.sayHelloQueue.add({ cat }, { delay: 3000 });

    return cat;
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ClassValidationPipe()) updateCatDTO: UpdateCatDTO,
  ): string {
    console.log(updateCatDTO);
    return `Updated #${id}`;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): string {
    return `Deleted #${id}`;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
